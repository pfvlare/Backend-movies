import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string;
}