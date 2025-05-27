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
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Registra um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async signUp(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(userData);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realiza login de usuário' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    async signIn(@Body() signInData: LoginDto) {
        return this.authService.signIn(signInData);
    }

    @Get('find/:id')
    @ApiOperation({ summary: 'Obtém informações do usuário logado' })
    @ApiResponse({ status: 200, description: 'Informações do usuário', type: UserResponseDto })
    async getUser(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.findUser({ id });
    }
}
