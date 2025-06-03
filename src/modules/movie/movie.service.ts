import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Movie } from '@prisma/client';

@Injectable()
export class MovieService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.MovieCreateInput): Promise<Movie> {
        return this.prisma.movie.create({ data });
    }

    async findAll(): Promise<Movie[]> {
        return this.prisma.movie.findMany();
    }

    async findOne(id: string): Promise<Movie> {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie) throw new Error('Movie not found');
        return movie;
    }


    async update(id: string, data: Prisma.MovieUpdateInput): Promise<Movie> {
        return this.prisma.movie.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Movie> {
        return this.prisma.movie.delete({ where: { id } });
    }
}
