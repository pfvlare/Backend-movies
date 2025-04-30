import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'O firstname é obrigatório' })
    firstname: string;

    @IsString()
    @IsNotEmpty({ message: 'O lastname é obrigatório' })
    lastname: string;

    @IsString()
    @IsNotEmpty({ message: 'O phone é obrigatório' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: 'O address é obrigatório' })
    address: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string;
}