import {
    Controller,
    Get,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { TmdbService } from './tmdb.service';

@ApiTags('person')
@Controller('person')
export class PersonController {
    constructor(private readonly tmbdService: TmdbService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar detalhes de uma pessoa' })
    @ApiParam({ name: 'id', description: 'ID da pessoa' })
    @ApiResponse({ status: 200, description: 'Detalhes da pessoa retornados com sucesso' })
    @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
    async getPersonDetails(@Param('id') id: string) {
        try {
            const personId = parseInt(id);
            if (isNaN(personId)) {
                throw new HttpException('ID da pessoa deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmbdService.getPersonDetails(personId);
        } catch (error) {
            throw error;
        }
    }

    @Get(':id/movie-credits')
    @ApiOperation({ summary: 'Buscar filmes de uma pessoa' })
    @ApiParam({ name: 'id', description: 'ID da pessoa' })
    @ApiResponse({ status: 200, description: 'Filmes da pessoa retornados com sucesso' })
    async getPersonMovieCredits(@Param('id') id: string) {
        try {
            const personId = parseInt(id);
            if (isNaN(personId)) {
                throw new HttpException('ID da pessoa deve ser um número', HttpStatus.BAD_REQUEST);
            }
            return await this.tmbdService.getPersonMovieCredits(personId);
        } catch (error) {
            throw error;
        }
    }
}