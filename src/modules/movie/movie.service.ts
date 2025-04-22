import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Prisma, Movie } from '@prisma/client';
import { MovieDto } from './dtos/movie.dto';

@Injectable()
export class MovieService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: MovieDto): Promise<Movie> {
        return this.prisma.movie.create({ data });
    }

    async findWhere(input: string): Promise<Movie[]> {
        return this.prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: input } },
                ]
            },
        });
    }

    async findOne(id: string): Promise<Movie | null> {
        return this.prisma.movie.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.MovieUpdateInput): Promise<Movie> {
        return this.prisma.movie.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Movie> {
        return this.prisma.movie.delete({ where: { id } });
    }
}