import { IsString, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiProperty({
        example: 'João',
        description: 'Nome do perfil',
        minLength: 1,
        maxLength: 20
    })
    @IsString({ message: 'Nome deve ser uma string' })
    @MinLength(1, { message: 'Nome deve ter pelo menos 1 caractere' })
    @MaxLength(20, { message: 'Nome deve ter no máximo 20 caracteres' })
    name: string;

    @ApiProperty({
        example: '#EC4899',
        description: 'Cor do perfil em formato hexadecimal'
    })
    @IsString({ message: 'Cor deve ser uma string' })
    @Matches(/^#[0-9A-F]{6}$/i, { message: 'Cor deve estar no formato hexadecimal (#RRGGBB)' })
    color: string;

    @ApiProperty({
        example: 'uuid-usuario',
        description: 'ID do usuário'
    })
    @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
    userId: string;
}