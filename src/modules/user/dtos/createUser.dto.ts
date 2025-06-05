import { IsEmail, IsEnum, IsNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Plan } from '@prisma/client';

// Criar DTO específico para subscription
export class CreateSubscriptionDto {
    @IsEnum(Plan, { message: 'plan must be one of the following values: basic, intermediary, complete' })
    plan: Plan;

    @IsNumber({}, { message: 'value must be a number' })
    value: number;
}

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    password: string;

    @ValidateNested()
    @Type(() => CreateSubscriptionDto)
    @IsNotEmpty()
    subscription: CreateSubscriptionDto;
}