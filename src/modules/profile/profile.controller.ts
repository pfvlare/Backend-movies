import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    ValidationPipe,
    UsePipes,
    HttpStatus,
    HttpException
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('profiles') // <- Importante: este decorator define o prefixo da rota
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async create(@Body() createProfileDto: CreateProfileDto) {
        try {
            return await this.profileService.create(
                createProfileDto.name,
                createProfileDto.color,
                createProfileDto.userId
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('user/:userId') // <- Esta rota será /profiles/user/:userId
    async findByUser(@Param('userId') userId: string) {
        try {
            console.log('🔍 Buscando perfis para userId:', userId);
            const profiles = await this.profileService.findByUser(userId);
            console.log('✅ Perfis encontrados:', profiles);
            return profiles;
        } catch (error) {
            console.error('❌ Erro no controller ao buscar perfis:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('user/:userId/limits') // <- Esta rota será /profiles/user/:userId/limits
    async getUserLimits(@Param('userId') userId: string) {
        try {
            console.log('🔍 Buscando limites para userId:', userId);
            const limits = await this.profileService.getUserProfileLimits(userId);
            console.log('✅ Limites encontrados:', limits);
            return limits;
        } catch (error) {
            console.error('❌ Erro no controller ao buscar limites:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':profileId')
    async findOne(@Param('profileId') profileId: string) {
        try {
            return await this.profileService.findOne(profileId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put(':profileId')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async update(
        @Param('profileId') id: string,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        try {
            return await this.profileService.update(
                id,
                updateProfileDto.name,
                updateProfileDto.color
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete(':profileId')
    async delete(@Param('profileId') profileId: string) {
        try {
            return await this.profileService.delete(profileId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Erro interno do servidor',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}