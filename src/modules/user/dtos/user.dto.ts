import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'E-mail do usuário, será armazenado em minúsculas'
    })
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string

    @ApiProperty({
        example: 'João',
        description: 'Nome próprio do usuário'
    })
    @IsString()
    @IsNotEmpty({ message: 'O firstname é obrigatório' })
    firstname: string

    @ApiProperty({
        example: 'Silva',
        description: 'Sobrenome do usuário'
    })
    @IsString()
    @IsNotEmpty({ message: 'O lastname é obrigatório' })
    lastname: string

    @ApiProperty({
        example: '+5511999998888',
        description: 'Telefone de contato, com código de país'
    })
    @IsString()
    @IsNotEmpty({ message: 'O phone é obrigatório' })
    phone: string

    @ApiProperty({
        example: 'Rua das Flores, 123, Apt 45',
        description: 'Endereço completo do usuário'
    })
    @IsString()
    @IsNotEmpty({ message: 'O address é obrigatório' })
    address: string

    @ApiProperty({
        example: 'senhaSegura123',
        minLength: 6,
        description: 'Senha de acesso, mínimo de seis caracteres'
    })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string
}
