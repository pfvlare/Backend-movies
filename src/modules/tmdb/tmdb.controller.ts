import {
    Controller,
    Get,
    Param,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { TmdbService } from './tmdb.service';

@ApiTags('tmdb')
@Controller('tmdb')
export class TmdbController {
    constructor(private readonly tmdbService: TmdbService) { }

    @Get('trending')
    @ApiOperation({ summary: 'Buscar filmes em alta' })
    @ApiQuery({ name: 'timeWindow', enum: ['day', 'week'], required: false })
    @ApiResponse({ status: 200, description: 'Filmes em alta retornados com sucesso' })
    async getTrendingMovies(@Query('timeWindow') timeWindow: 'day' | 'week' = 'day') {
        try {
            return await this.tmdbService.getTrendingMovies(timeWindow);
        } catch (error) {
            throw error;
        }
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Buscar próximos lançamentos' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Próximos lançamentos retornados com sucesso' })
    async getUpcomingMovies(@Query('page') page?: string) {
        try {
            const pageNumber = page ? parseInt(page) : 1;
            return await this.tmdbService.getUpcomingMovies(pageNumber);
        } catch (error) {
            throw error;
        }
    }

    @Get('top-rated')
    @ApiOperation({ summary: 'Buscar filmes mais bem avaliados' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Filmes mais bem avaliados retornados com sucesso' })
    async getTopRatedMovies(@Query('page') page?: string) {
        try {
            const pageNumber = page ? parseInt(page) : 1;
            return await this.tmdbService.getTopRatedMovies(pageNumber);
        } catch (error) {
            throw error;
        }
    }

    @Get('popular')
    @ApiOperation({ summary: 'Buscar filmes populares' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Filmes populares retornados com sucesso' })
    async getPopularMovies(@Query('page') page?: string) {
        try {
            const pageNumber = page ? parseInt(page) : 1;
            return await this.tmdbService.getPopularMovies(pageNumber);
        } catch (error) {
            throw error;
        }
    }

    @Get('search')
    @ApiOperation({ summary: 'Pesquisar filmes' })
    @ApiQuery({ name: 'q', description: 'Termo de busca' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Resultados da pesquisa retornados com sucesso' })
    async searchMovies(
        @Query('q') query: string,
        @Query('page') page?: string,
    ) {
        try {
            if (!query) {
                throw new HttpException('Parâmetro de busca é obrigatório', HttpStatus.BAD_REQUEST);
            }
            const pageNumber = page ? parseInt(page) : 1;
            return await this.tmdbService.searchMovies(query, pageNumber);
        } catch (error) {
            throw error;
        }
    }

    @Get('genres')
    @ApiOperation({ summary: 'Buscar gêneros disponíveis' })
    @ApiResponse({ status: 200, description: 'Gêneros retornados com sucesso' })
    async getGenres() {
        try {
            return await this.tmdbService.getGenres();
        } catch (error) {
            throw error;
        }
    }

    @Get('movie/:id')
    @ApiOperation({ summary: 'Buscar detalhes de um filme' })
    @ApiParam({ name: 'id', description: 'ID do filme' })
    @ApiResponse({ status: 200, description: 'Detalhes do filme retornados com sucesso' })
    async getMovieDetails(@Param('id') id: string) {
        try {
            const movieId = parseInt(id);
            if (isNaN(movieId)) {
                throw new HttpException('ID do filme deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmdbService.getMovieDetails(movieId);
        } catch (error) {
            throw error;
        }
    }

    @Get('movie/:id/credits')
    @ApiOperation({ summary: 'Buscar elenco e equipe de um filme' })
    @ApiParam({ name: 'id', description: 'ID do filme' })
    @ApiResponse({ status: 200, description: 'Elenco e equipe retornados com sucesso' })
    async getMovieCredits(@Param('id') id: string) {
        try {
            const movieId = parseInt(id);
            if (isNaN(movieId)) {
                throw new HttpException('ID do filme deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmdbService.getMovieCredits(movieId);
        } catch (error) {
            throw error;
        }
    }

    @Get('movie/:id/similar')
    @ApiOperation({ summary: 'Buscar filmes similares' })
    @ApiParam({ name: 'id', description: 'ID do filme' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Filmes similares retornados com sucesso' })
    async getSimilarMovies(
        @Param('id') id: string,
        @Query('page') page?: string,
    ) {
        try {
            const movieId = parseInt(id);
            if (isNaN(movieId)) {
                throw new HttpException('ID do filme deve ser um número', HttpStatus.BAD_REQUEST);
            }
            const pageNumber = page ? parseInt(page) : 1;
            return await this.tmdbService.getSimilarMovies(movieId, pageNumber);
        } catch (error) {
            throw error;
        }
    }

    @Get('person/:id')
    @ApiOperation({ summary: 'Buscar detalhes de uma pessoa' })
    @ApiParam({ name: 'id', description: 'ID da pessoa' })
    @ApiResponse({ status: 200, description: 'Detalhes da pessoa retornados com sucesso' })
    async getPersonDetails(@Param('id') id: string) {
        try {
            const personId = parseInt(id);
            if (isNaN(personId)) {
                throw new HttpException('ID da pessoa deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmdbService.getPersonDetails(personId);
        } catch (error) {
            throw error;
        }
    }

    @Get('person/:id/movie-credits')
    @ApiOperation({ summary: 'Buscar filmes de uma pessoa' })
    @ApiParam({ name: 'id', description: 'ID da pessoa' })
    @ApiResponse({ status: 200, description: 'Filmes da pessoa retornados com sucesso' })
    async getPersonMovieCredits(@Param('id') id: string) {
        try {
            const personId = parseInt(id);
            if (isNaN(personId)) {
                throw new HttpException('ID da pessoa deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmdbService.getPersonMovieCredits(personId);
        } catch (error) {
            throw error;
        }
    }
}