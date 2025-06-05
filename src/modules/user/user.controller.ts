import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Patch } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { LoginDto } from '../auth/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
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
    @ApiResponse({ status: 400, description: 'Dados inválidos ou email já existe' })
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
    @ApiOperation({ summary: 'Obtém informações do usuário por ID' })
    @ApiParam({ name: 'id', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async getUser(@Param('id') id: string): Promise<UserResponseDto> {
        return this.userService.findById(id);
    }

    @Put('update/:id')
    @ApiOperation({ summary: 'Atualiza informações do usuário' })
    @ApiParam({ name: 'id', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou email já existe' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async updateUser(
        @Param('id') id: string,
        @Body() updateData: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.updateUser(id, updateData);
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Atualiza parcialmente informações do usuário' })
    @ApiParam({ name: 'id', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou email já existe' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async patchUser(
        @Param('id') id: string,
        @Body() updateData: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.userService.updateUser(id, updateData);
    }
}