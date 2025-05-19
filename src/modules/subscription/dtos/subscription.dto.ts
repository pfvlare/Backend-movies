import { IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';

export class SubscriptionDto {
    @ApiProperty({ enum: Plan, example: Plan.basic })
    @IsEnum(Plan)
    plan: Plan;

    @ApiProperty({ example: 49.9 })
    @IsNumber()
    value: number;

    @ApiProperty({ example: '2025-05-12T10:30:00.000Z' })
    @IsDateString()
    registeredAt: string;

    @ApiProperty({ example: '2026-05-12T10:30:00.000Z' })
    @IsDateString()
    expiresAt: string;
}