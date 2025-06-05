import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Put,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@ApiTags('profiles')
@Controller('profiles')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo perfil' })
    @ApiResponse({ status: 201, description: 'Perfil criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou limite atingido' })
    create(@Body() createProfileDto: CreateProfileDto) {
        console.log('🔄 POST /profiles', createProfileDto);
        return this.profileService.create(createProfileDto);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Buscar perfis de um usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Perfis encontrados' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    findByUser(@Param('userId') userId: string) {
        console.log('🔍 GET /profiles/user/:userId', { userId });
        return this.profileService.findByUser(userId);
    }

    @Get('user/:userId/limits')
    @ApiOperation({ summary: 'Buscar limites de perfis do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Limites encontrados' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    getUserLimits(@Param('userId') userId: string) {
        console.log('🔍 GET /profiles/user/:userId/limits', { userId });
        return this.profileService.getUserProfileLimits(userId);
    }

    @Post('user/:userId/enforce-limits')
    @ApiOperation({ summary: 'Aplicar limites de perfis (remover excesso)' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Limites aplicados' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    enforceProfileLimits(@Param('userId') userId: string) {
        console.log('🔧 POST /profiles/user/:userId/enforce-limits', { userId });
        return this.profileService.enforceProfileLimits(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um perfil específico' })
    @ApiParam({ name: 'id', description: 'UUID do perfil' })
    @ApiResponse({ status: 200, description: 'Perfil encontrado' })
    @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
    findOne(@Param('id') id: string) {
        console.log('🔍 GET /profiles/:id', { id });
        return this.profileService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um perfil' })
    @ApiParam({ name: 'id', description: 'UUID do perfil' })
    @ApiResponse({ status: 200, description: 'Perfil atualizado' })
    @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
        console.log('✏️ PUT /profiles/:id', { id, updateProfileDto });
        return this.profileService.update(id, updateProfileDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir um perfil' })
    @ApiParam({ name: 'id', description: 'UUID do perfil' })
    @ApiResponse({ status: 200, description: 'Perfil excluído' })
    @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
    @ApiResponse({ status: 400, description: 'Não é possível excluir o último perfil' })
    remove(@Param('id') id: string) {
        console.log('🗑️ DELETE /profiles/:id', { id });
        return this.profileService.delete(id);
    }
}