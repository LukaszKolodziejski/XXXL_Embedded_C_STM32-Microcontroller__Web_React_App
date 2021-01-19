/*
 * bh1750.c
 *
 *  Created on: Nov 28, 2020
 *      Author: Kuba
 */


#include "bh1750.h"


void BH1750_Init(BH1750_HandleTypeDef* bh1750){
	uint8_t command;

	command = BH1750_POWER_ON;
	HAL_I2C_Master_Transmit(bh1750 -> I2C, bh1750 -> Address, &command, 1, bh1750 -> Timeout);

	command = BH1750_CONTINOUS_H_RES_MODE;
	HAL_I2C_Master_Transmit(bh1750 -> I2C, bh1750 -> Address, &command, 1, bh1750 -> Timeout);
}


float BH1750_ReadLux(BH1750_HandleTypeDef* bh1750){
	float lux = 0;
	uint8_t data[2];


	HAL_I2C_Master_Receive(bh1750 -> I2C, bh1750 -> Address, data, 2, bh1750 -> Timeout);
    lux = ((data[0] << 8) | data[1]) /1.2;

    return lux;
}
