import { IsUUID, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Plan } from '@prisma/client';

export class SubscriptionDto {
    @IsEnum(Plan)
    plan: Plan;

    @IsNumber()
    value: number;

    @IsDateString()
    registeredAt: string;

    @IsDateString()
    expiresAt: string;

    @IsUUID()
    userId: string;
}
