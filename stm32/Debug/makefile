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
all: Project_9_00_STM32_React_FullApp.elf secondary-outputs

# Tool invocations
Project_9_00_STM32_React_FullApp.elf: $(OBJS) $(USER_OBJS) C:\Users\Lenovo\STM32CubeIDE\workspace_1.4.0\Project_9_00_STM32_React_FullApp\STM32F746ZGTX_FLASH.ld
	arm-none-eabi-gcc -o "Project_9_00_STM32_React_FullApp.elf" @"objects.list" $(USER_OBJS) $(LIBS) -mcpu=cortex-m7 -T"C:\Users\Lenovo\STM32CubeIDE\workspace_1.4.0\Project_9_00_STM32_React_FullApp\STM32F746ZGTX_FLASH.ld" --specs=nosys.specs -Wl,-Map="Project_9_00_STM32_React_FullApp.map" -Wl,--gc-sections -static --specs=nano.specs -mfpu=fpv5-sp-d16 -mfloat-abi=hard -mthumb -Wl,--start-group -lc -lm -Wl,--end-group
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

.PHONY: all clean dependents
.SECONDARY:

-include ../makefile.targets
