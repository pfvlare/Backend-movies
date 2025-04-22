import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDto } from './dtos/movie.dto';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    findAll(@Param('input') input: string) {
        return this.movieService.findWhere(input);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.movieService.findOne(id);
    }

    @Post()
    create(@Body() createMovieDto: MovieDto) {
        return this.movieService.create(createMovieDto);
    }
}