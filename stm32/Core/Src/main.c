/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2021 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under BSD 3-Clause license,
  * the "License"; You may not use this file except in compliance with the
  * License. You may obtain a copy of the License at:
  *                        opensource.org/licenses/BSD-3-Clause
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"
#include "eth.h"
#include "i2c.h"
#include "tim.h"
#include "usart.h"
#include "usb_otg.h"
#include "gpio.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include "stdio.h"
#include "string.h"
#include "bh1750.h"
#include "bh1750_config.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/

/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

char json_data[26];

// RED -> controlled by Web App
int RED_percent = 0;

// BLUE -> controlled by Encoder
int BLUE_percent = 0;

// read from Web App
int luks_set = 50;

// read in a loop
int luks_read = 50;
int deviation = 0; // PL - "Uchyb"
int counter_en = 0;
int connected = 0;

// constant
float k = 1;


void transmit_IT_Json_Data(int percent, int lux );

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart){
	if(huart-> Instance == USART3){
	  connected = 1;

	  //char json_data [26]="{\"lux\":1000,\"percent\":100}";

	  int percent [1];
	  int lux [1];
	  char * pch;

	  pch = strtok (json_data," \":,{}");

	   while (pch != NULL)
	  {
	    if(strcmp( pch, "percent" ) == 0){
	        pch = strtok (NULL, " \":,{}");
	        sscanf (pch,"%d",percent);
	    } else if(strcmp( pch, "lux" ) == 0){
	        pch = strtok (NULL, " \":,{}");
	        sscanf (pch,"%d",lux);
	    }
	    pch = strtok (NULL, " \":,{}");
	  }
	   lux[0] -= 1000;
	   percent[0] -= 100;

	   if(percent[0]<25){
			HAL_GPIO_WritePin(GPIOB, LD1_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(GPIOB, LD2_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(GPIOB, LD3_Pin, GPIO_PIN_RESET);
	   }else if((percent[0]>=25)&&(percent[0]<50)){
			HAL_GPIO_WritePin(GPIOB, LD1_Pin, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, LD2_Pin, GPIO_PIN_RESET);
			HAL_GPIO_WritePin(GPIOB, LD3_Pin, GPIO_PIN_RESET);
	   }else if((percent[0]>=50)&&(percent[0]<75)){
			HAL_GPIO_WritePin(GPIOB, LD1_Pin, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, LD2_Pin, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, LD3_Pin, GPIO_PIN_RESET);
	   }else if(percent[0]>=75){
			HAL_GPIO_WritePin(GPIOB, LD1_Pin, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, LD2_Pin, GPIO_PIN_SET);
			HAL_GPIO_WritePin(GPIOB, LD3_Pin, GPIO_PIN_SET);
	   }
	   luks_set = percent[0];
	   lux[0] = luks_read;

	   transmit_IT_Json_Data(percent[0], lux[0] );

	   HAL_UART_Receive_IT(&huart3, (uint8_t*)json_data, 26);

	}
}

void transmit_IT_Json_Data(int percent, int lux ){
	if((0 <= percent) && (percent <= 100) && (0 <= lux) && (lux <= 1000)){
		char new_Json_Data[26];

		int n=sprintf (new_Json_Data, "{\"lux\":%d,\"percent\":%d}", lux, percent);

		HAL_UART_Transmit_IT(&huart3, (uint8_t*)new_Json_Data, n);
	}
}

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{
  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_ETH_Init();
  MX_USART3_UART_Init();
  MX_USB_OTG_FS_PCD_Init();
  MX_I2C1_Init();
  MX_TIM3_Init();
  MX_TIM4_Init();
  /* USER CODE BEGIN 2 */

  HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_1);
  HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_2);
  HAL_TIM_Encoder_Start(&htim4, TIM_CHANNEL_ALL);

  // sensor initialization
  BH1750_Init(&hbh1750_1);

  HAL_UART_Receive_IT(&huart3, (uint8_t*)json_data, 26);
  __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, RED_percent);

  char new_Json_Data[26];
  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  while (1)
  {
	luks_read = (int)(BH1750_ReadLux(&hbh1750_1));
	deviation = (luks_set - luks_read);
	RED_percent += (int)(k*deviation);

	if(RED_percent > 1000) RED_percent = 1000;
	if(RED_percent < 0)	RED_percent = 0;
	
	__HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, RED_percent);
	BLUE_percent = __HAL_TIM_GET_COUNTER(&htim4);
	__HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_2, BLUE_percent);

	if(connected == 1){
		int n=sprintf (new_Json_Data, "{\"lux\":%d,\"percent\":%d}", luks_read, luks_set);

		HAL_UART_Transmit(&huart3, (uint8_t*)new_Json_Data, n, 100);
	}

    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
	HAL_Delay(250);
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};
  RCC_PeriphCLKInitTypeDef PeriphClkInitStruct = {0};

  /** Configure LSE Drive Capability
  */
  HAL_PWR_EnableBkUpAccess();
  /** Configure the main internal regulator output voltage
  */
  __HAL_RCC_PWR_CLK_ENABLE();
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE3);
  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
  RCC_OscInitStruct.HSEState = RCC_HSE_BYPASS;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
  RCC_OscInitStruct.PLL.PLLM = 4;
  RCC_OscInitStruct.PLL.PLLN = 72;
  RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
  RCC_OscInitStruct.PLL.PLLQ = 3;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
  {
    Error_Handler();
  }
  PeriphClkInitStruct.PeriphClockSelection = RCC_PERIPHCLK_USART3|RCC_PERIPHCLK_I2C1
                              |RCC_PERIPHCLK_CLK48;
  PeriphClkInitStruct.Usart3ClockSelection = RCC_USART3CLKSOURCE_PCLK1;
  PeriphClkInitStruct.I2c1ClockSelection = RCC_I2C1CLKSOURCE_PCLK1;
  PeriphClkInitStruct.Clk48ClockSelection = RCC_CLK48SOURCE_PLL;
  if (HAL_RCCEx_PeriphCLKConfig(&PeriphClkInitStruct) != HAL_OK)
  {
    Error_Handler();
  }
}

/* USER CODE BEGIN 4 */

/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */

  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     tex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
