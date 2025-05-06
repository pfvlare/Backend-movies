import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'E-mail do usuário cadastrado'
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'senhaSegura123',
        description: 'Senha de acesso do usuário'
    })
    @IsString()
    password: string
}
