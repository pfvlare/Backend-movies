import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'E-mail do usuário',
        required: false
    })
    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email?: string;

    @ApiProperty({
        example: 'João',
        description: 'Nome próprio do usuário',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O firstname não pode estar vazio' })
    firstname?: string;

    @ApiProperty({
        example: 'Silva',
        description: 'Sobrenome do usuário',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O lastname não pode estar vazio' })
    lastname?: string;

    @ApiProperty({
        example: '+5511999998888',
        description: 'Telefone de contato',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O phone não pode estar vazio' })
    phone?: string;

    @ApiProperty({
        example: 'Rua das Flores, 123, Apt 45',
        description: 'Endereço completo do usuário',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O address não pode estar vazio' })
    address?: string;
}