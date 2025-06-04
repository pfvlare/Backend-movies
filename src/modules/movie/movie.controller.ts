import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Post()
    create(@Body() data: Prisma.MovieCreateInput) {
        return this.movieService.create(data);
    }

    @Get()
    findAll() {
        return this.movieService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.movieService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Prisma.MovieUpdateInput) {
        return this.movieService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.movieService.delete(id);
    }
}
