import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiProperty({ example: 'Joãozinho', description: 'Nome do perfil' })
    @IsString()
    name: string;

    @ApiProperty({ example: '#EC4899', description: 'Cor do perfil (hex)' })
    @IsString()
    color: string;

    @ApiProperty({ example: 'uuid-usuario', description: 'ID do usuário' })
    @IsUUID()
    userId: string;
}