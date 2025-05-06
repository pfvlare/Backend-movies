import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieDto } from './dtos/movie.dto'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody
} from '@nestjs/swagger'

@ApiTags('movies')
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos os filmes ou filtra por nome' })
    @ApiQuery({ name: 'input', required: false, description: 'Texto para busca por nome do filme' })
    @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso' })
    findAll(@Query('input') input: string) {
        return this.movieService.findWhere(input)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um filme pelo ID' })
    @ApiParam({ name: 'id', description: 'UUID do filme' })
    @ApiResponse({ status: 200, description: 'Filme retornado com sucesso' })
    findOne(@Param('id') id: string) {
        return this.movieService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Cria um novo filme' })
    @ApiResponse({ status: 201, description: 'Filme criado com sucesso' })
    @ApiBody({ type: MovieDto })
    create(@Body() createMovieDto: MovieDto) {
        return this.movieService.create(createMovieDto)
    }
}
