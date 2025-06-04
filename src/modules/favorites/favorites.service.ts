import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string) {
        return this.prisma.favorites.create({
            data: {
                userId,
                movieIds: [],
            },
        });
    }

    async findAll() {
        return this.prisma.favorites.findMany();
    }

    async findByUserId(userId: string) {
        const favorites = await this.prisma.favorites.findUnique({
            where: { userId },
        });
        if (!favorites) {
            throw new NotFoundException('Favoritos não encontrados');
        }
        return favorites;
    }

    async addMovieToFavorites(userId: string, movieId: string) {
        const favorites = await this.prisma.favorites.upsert({
            where: { userId },
            create: { userId, movieIds: [movieId] },
            update: {},
        });

        if (favorites.movieIds.includes(movieId)) return favorites;

        return this.prisma.favorites.update({
            where: { userId },
            data: {
                movieIds: {
                    push: movieId,
                },
            },
        });
    }

    async removeMovieFromFavorites(userId: string, movieId: string) {
        const favorites = await this.findByUserId(userId);
        const filtered = favorites.movieIds.filter((id) => id !== movieId);

        return this.prisma.favorites.update({
            where: { userId },
            data: {
                movieIds: filtered,
            },
        });
    }
}
