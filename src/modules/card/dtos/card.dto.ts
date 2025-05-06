import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDto {
    @ApiProperty({
        example: 'f12a7f90-b60e-4891-91a2-d92fa70eeabc',
        description: 'Identificador único do cartão',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'João da Silva',
        description: 'Nome impresso no cartão',
    })
    @IsString()
    nameCard: string;

    @ApiProperty({
        example: '4111111111111111',
        description: 'Número do cartão de crédito',
    })
    @IsString()
    cardNumber: string;

    @ApiProperty({
        example: '2026-12-31T23:59:59.999Z',
        description: 'Data de expiração do cartão',
    })
    @IsDateString()
    expiresDate: Date;

    @ApiProperty({
        example: '123',
        description: 'Código de segurança (CVV) do cartão',
    })
    @IsString()
    securityCode: string;

    @ApiProperty({
        example: 'a123b456-c789-0123-d456-7890ef123456',
        description: 'ID do usuário proprietário do cartão',
    })
    @IsUUID()
    userId: string;
}
