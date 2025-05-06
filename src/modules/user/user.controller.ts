import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { CreateUserDto } from './dtos/user.dto'
import { LoginDto } from '../auth/dto/login.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Registra um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: CreateUserDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async signUp(@Body() userData: CreateUserDto): Promise<User> {
        return this.userService.createUser(userData)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realiza login de usuário' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    async signIn(@Body() signInData: LoginDto): Promise<Omit<User, 'password'>> {
        return this.authService.signIn(signInData)
    }
}
