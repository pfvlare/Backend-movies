import { Controller, Post, Get, Param, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post(':userId')
    create(@Param('userId') userId: string) {
        return this.favoritesService.create(userId);
    }

    @Get()
    findAll() {
        return this.favoritesService.findAll();
    }

    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string) {
        return this.favoritesService.findByUserId(userId);
    }

    @Post('add/:userId/:movieId')
    addMovie(@Param('userId') userId: string, @Param('movieId') movieId: string) {
        return this.favoritesService.addMovieToFavorites(userId, movieId);
    }

    @Delete('remove/:userId/:movieId')
    removeMovie(@Param('userId') userId: string, @Param('movieId') movieId: string) {
        return this.favoritesService.removeMovieFromFavorites(userId, movieId);
    }
}
