import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Plan, Subscription } from '@prisma/client';

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

    @IsEnum(Plan)
    plan: Plan;

    @IsNotEmpty()
    subscription: Subscription
}
