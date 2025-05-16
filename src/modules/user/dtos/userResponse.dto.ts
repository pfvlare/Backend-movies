import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: 'clx123456', description: 'ID do usuário' })
    id: string;

    @ApiProperty({ example: 'usuario@email.com' })
    email: string;

    @ApiProperty({ example: 'João' })
    firstname: string;

    @ApiProperty({ example: 'Silva' })
    lastname: string;

    @ApiProperty({ example: '+5511999999999' })
    phone: string;

    @ApiProperty({ example: 'Rua X, 123' })
    address: string;
}
