import { IsUUID, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';

export class SubscriptionDto {
    @ApiProperty({ enum: Plan, example: Plan.complete })
    @IsEnum(Plan)
    plan: Plan;

    @ApiProperty({ example: 49.9 })
    @IsNumber()
    value: number;

    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    registeredAt: string;

    @ApiProperty({ example: '2025-01-01T00:00:00Z' })
    @IsDateString()
    expiresAt: string;

    @ApiProperty({ example: 'uuid-aqui' })
    @IsUUID()
    userId: string;
}
