import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { LoginDto } from '../auth/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserResponseDto } from './dtos/userResponse.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService // <-- Injetado corretamente via forwardRef
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Registra um novo usuário' })
    async signUp(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(userData);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realiza login de usuário' })
    async signIn(@Body() signInData: LoginDto) {
        return this.authService.signIn(signInData); // <-- Certifique-se que esse método existe e retorna token
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Obtém informações do usuário' })
    async getUser(@Param('id') id: string) {
        return this.authService.getUser(id);
    }
}
