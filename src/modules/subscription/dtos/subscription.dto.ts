import {
    IsEnum,
    IsNumber,
    IsDateString,
    IsOptional,
    IsPositive,
    Min,
    IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { Transform } from 'class-transformer';

export class SubscriptionDto {
    @ApiProperty({
        enum: Plan,
        example: Plan.basic,
        description: 'Tipo do plano de assinatura'
    })
    @IsEnum(Plan, { message: 'Plano deve ser: BASIC, INTERMEDIARY ou COMPLETE' })
    plan: Plan;

    @ApiProperty({
        example: 18.90,
        description: 'Valor da assinatura em reais',
        minimum: 0.01
    })
    @IsNumber({}, { message: 'Valor deve ser um número' })
    @IsPositive({ message: 'Valor deve ser maior que 0' })
    value: number;

    @ApiProperty({
        example: '2025-06-05T14:40:44.000Z',
        description: 'Data de registro da assinatura'
    })
    @IsDateString({}, { message: 'Data de registro deve ser uma data válida' })
    registeredAt: string;

    @ApiProperty({
        example: '2026-06-05T14:40:44.000Z',
        description: 'Data de expiração da assinatura'
    })
    @IsDateString({}, { message: 'Data de expiração deve ser uma data válida' })
    expiresAt: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID do usuário'
    })
    @IsNotEmpty({ message: 'UserId é obrigatório' })
    userId: string;
}

export class SubscriptionReqDto {
    @ApiProperty({
        enum: Plan,
        example: Plan.basic,
        description: 'Tipo do plano de assinatura',
        enumName: 'Plan'
    })
    @IsEnum(Plan, { message: 'Plano deve ser: BASIC, INTERMEDIARY ou COMPLETE' })
    @IsNotEmpty({ message: 'Plano é obrigatório' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toUpperCase() as Plan;
        }
        return value;
    })
    plan: Plan;

    @ApiProperty({
        example: 18.90,
        description: 'Valor da assinatura em reais',
        minimum: 0.01,
        type: 'number'
    })
    @IsNumber({}, { message: 'Valor deve ser um número' })
    @Min(0.01, { message: 'Valor deve ser maior que 0' })
    @Transform(({ value }) => {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return num;
    })
    value: number;
}

export class UpdateSubscriptionDto {
    @ApiProperty({
        enum: Plan,
        example: Plan.basic,
        description: 'Tipo do plano de assinatura',
        required: false
    })
    @IsOptional()
    @IsEnum(Plan, { message: 'Plano deve ser: BASIC, INTERMEDIARY ou COMPLETE' })
    @Transform(({ value }) => {
        if (value && typeof value === 'string') {
            return value.toUpperCase() as Plan;
        }
        return value;
    })
    plan?: Plan;

    @ApiProperty({
        example: 18.90,
        description: 'Valor da assinatura em reais',
        minimum: 0.01,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: 'Valor deve ser um número' })
    @Min(0.01, { message: 'Valor deve ser maior que 0' })
    @Transform(({ value }) => {
        if (value === undefined || value === null) return value;
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Valor inválido: ${value}`);
        }
        return num;
    })
    value?: number;

    @ApiProperty({
        example: '2026-06-05T14:40:44.000Z',
        description: 'Nova data de expiração da assinatura',
        required: false
    })
    @IsOptional()
    @IsDateString({}, { message: 'Data de expiração deve ser uma data válida' })
    expiresAt?: string;
}

// DTO para resposta com informações do usuário
export class SubscriptionWithUserDto extends SubscriptionDto {
    @ApiProperty({
        description: 'Informações do usuário',
        type: 'object',
        properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstname: { type: 'string' },
            lastname: { type: 'string' }
        }
    })
    user: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
    };
}

// DTO para status da assinatura
export class SubscriptionStatusDto {
    @ApiProperty({
        example: true,
        description: 'Se o usuário possui assinatura'
    })
    hasSubscription: boolean;

    @ApiProperty({
        example: true,
        description: 'Se a assinatura está ativa'
    })
    isActive: boolean;

    @ApiProperty({
        enum: Plan,
        example: Plan.basic,
        description: 'Plano atual (null se não tiver assinatura)',
        nullable: true
    })
    plan: Plan | null;

    @ApiProperty({
        example: '2026-06-05T14:40:44.000Z',
        description: 'Data de expiração (null se não tiver assinatura)',
        nullable: true
    })
    expiresAt: string | null;

    @ApiProperty({
        example: 365,
        description: 'Dias até expiração (0 se expirada)',
        minimum: 0
    })
    daysUntilExpiry: number;
}