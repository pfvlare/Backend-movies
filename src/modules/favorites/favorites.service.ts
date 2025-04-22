import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Favorites, Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string): Promise<Favorites> {
        return this.prisma.favorites.create({
            data: {
                userId,
            },
        });
    }

    async findAll(): Promise<Favorites[]> {
        return this.prisma.favorites.findMany({
            include: {
                Movie: true,
                user: true,
            },
        });
    }

    async findByUserId(userId: string): Promise<Favorites | null> {
        return this.prisma.favorites.findUnique({
            where: { userId },
            include: {
                Movie: true,
            },
        });
    }

    async addMovieToFavorites(userId: string, movieId: string): Promise<Favorites> {
        return this.prisma.favorites.update({
            where: { userId },
            data: {
                Movie: {
                    connect: { id: movieId },
                },
            },
            include: {
                Movie: true,
            },
        });
    }

    async removeMovieFromFavorites(userId: string, movieId: string): Promise<Favorites> {
        return this.prisma.favorites.update({
            where: { userId },
            data: {
                Movie: {
                    disconnect: { id: movieId },
                },
            },
            include: {
                Movie: true,
            },
        });
    }
}
