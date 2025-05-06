import { IsUUID, IsEnum, IsNumber, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Plan } from '@prisma/client'

export class SubscriptionDto {
    @ApiProperty({
        enum: Plan,
        description: 'Tipo de plano selecionado',
        example: Plan.complete
    })
    @IsEnum(Plan)
    plan: Plan

    @ApiProperty({
        example: 49.9,
        description: 'Valor pago pela assinatura'
    })
    @IsNumber()
    value: number

    @ApiProperty({
        example: '2024-01-01T00:00:00Z',
        description: 'Data em que a assinatura foi registrada'
    })
    @IsDateString()
    registeredAt: string

    @ApiProperty({
        example: '2025-01-01T00:00:00Z',
        description: 'Data de expiração da assinatura'
    })
    @IsDateString()
    expiresAt: string

    @ApiProperty({
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Identificador do usuário que possui a assinatura'
    })
    @IsUUID()
    userId: string
}
