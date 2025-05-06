import { Controller, Post, Get, Param, Delete } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam
} from '@nestjs/swagger'

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post(':userId')
    @ApiOperation({ summary: 'Cria a lista de favoritos para o usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 201, description: 'Lista de favoritos criada' })
    create(@Param('userId') userId: string) {
        return this.favoritesService.create(userId)
    }

    @Get()
    @ApiOperation({ summary: 'Retorna todas as listas de favoritos' })
    @ApiResponse({ status: 200, description: 'Listas retornadas com sucesso' })
    findAll() {
        return this.favoritesService.findAll()
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Retorna a lista de favoritos de um usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
    findByUserId(@Param('userId') userId: string) {
        return this.favoritesService.findByUserId(userId)
    }

    @Post('add/:userId/:movieId')
    @ApiOperation({ summary: 'Adiciona um filme aos favoritos do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiParam({ name: 'movieId', description: 'UUID do filme' })
    @ApiResponse({ status: 200, description: 'Filme adicionado com sucesso' })
    addMovie(@Param('userId') userId: string, @Param('movieId') movieId: string) {
        return this.favoritesService.addMovieToFavorites(userId, movieId)
    }

    @Delete('remove/:userId/:movieId')
    @ApiOperation({ summary: 'Remove um filme dos favoritos do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiParam({ name: 'movieId', description: 'UUID do filme' })
    @ApiResponse({ status: 200, description: 'Filme removido com sucesso' })
    removeMovie(@Param('userId') userId: string, @Param('movieId') movieId: string) {
        return this.favoritesService.removeMovieFromFavorites(userId, movieId)
    }
}
