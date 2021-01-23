################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.init

RM := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include Drivers/STM32F7xx_HAL_Driver/Src/subdir.mk
-include Core/Startup/subdir.mk
-include Core/Src/subdir.mk
-include subdir.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

-include ../makefile.defs

BUILD_ARTIFACT_NAME := Project_9_00_STM32_React_FullApp
BUILD_ARTIFACT_EXTENSION := elf
BUILD_ARTIFACT_PREFIX := 
BUILD_ARTIFACT := $(BUILD_ARTIFACT_PREFIX)$(BUILD_ARTIFACT_NAME).$(BUILD_ARTIFACT_EXTENSION)

# Add inputs and outputs from these tool invocations to the build variables 
EXECUTABLES += \
Project_9_00_STM32_React_FullApp.elf \

SIZE_OUTPUT += \
default.size.stdout \

OBJDUMP_LIST += \
Project_9_00_STM32_React_FullApp.list \

OBJCOPY_BIN += \
Project_9_00_STM32_React_FullApp.bin \


# All Target
all: main-build

# Main-build Target
main-build: Project_9_00_STM32_React_FullApp.elf secondary-outputs

# Tool invocations
Project_9_00_STM32_React_FullApp.elf: $(OBJS) $(USER_OBJS) C:\Users\Kuba\Desktop\SEM\ 5\SM\ lab\projekt\XXXL_Embedded_C_STM32-Microcontroller__Web_React_App-main\stm32\STM32F746ZGTX_FLASH.ld
	arm-none-eabi-gcc -o "Project_9_00_STM32_React_FullApp.elf" @"objects.list" $(USER_OBJS) $(LIBS) -mcpu=cortex-m7 -T"C:\Users\Kuba\Desktop\SEM 5\SM lab\projekt\XXXL_Embedded_C_STM32-Microcontroller__Web_React_App-main\stm32\STM32F746ZGTX_FLASH.ld" --specs=nosys.specs -Wl,-Map="Project_9_00_STM32_React_FullApp.map" -Wl,--gc-sections -static --specs=nano.specs -mfpu=fpv5-sp-d16 -mfloat-abi=hard -mthumb -Wl,--start-group -lc -lm -Wl,--end-group
	@echo 'Finished building target: $@'
	@echo ' '

default.size.stdout: $(EXECUTABLES)
	arm-none-eabi-size  $(EXECUTABLES)
	@echo 'Finished building: $@'
	@echo ' '

Project_9_00_STM32_React_FullApp.list: $(EXECUTABLES)
	arm-none-eabi-objdump -h -S $(EXECUTABLES) > "Project_9_00_STM32_React_FullApp.list"
	@echo 'Finished building: $@'
	@echo ' '

Project_9_00_STM32_React_FullApp.bin: $(EXECUTABLES)
	arm-none-eabi-objcopy  -O binary $(EXECUTABLES) "Project_9_00_STM32_React_FullApp.bin"
	@echo 'Finished building: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) *
	-@echo ' '

secondary-outputs: $(SIZE_OUTPUT) $(OBJDUMP_LIST) $(OBJCOPY_BIN)

fail-specified-linker-script-missing:
	@echo 'Error: Cannot find the specified linker script. Check the linker settings in the build configuration.'
	@exit 2

warn-no-linker-script-specified:
	@echo 'Warning: No linker script specified. Check the linker settings in the build configuration.'

.PHONY: all clean dependents fail-specified-linker-script-missing warn-no-linker-script-specified
.SECONDARY:

-include ../makefile.targets
