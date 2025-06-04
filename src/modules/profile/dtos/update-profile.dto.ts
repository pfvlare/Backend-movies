import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({
        example: 'João',
        description: 'Nome do perfil',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Nome deve ser uma string' })
    @MinLength(1, { message: 'Nome deve ter pelo menos 1 caractere' })
    @MaxLength(20, { message: 'Nome deve ter no máximo 20 caracteres' })
    name?: string;

    @ApiProperty({
        example: '#EC4899',
        description: 'Cor do perfil em formato hexadecimal',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Cor deve ser uma string' })
    @Matches(/^#[0-9A-F]{6}$/i, { message: 'Cor deve estar no formato hexadecimal (#RRGGBB)' })
    color?: string;
}