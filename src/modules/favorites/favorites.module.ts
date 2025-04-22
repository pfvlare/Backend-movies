import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../database/prisma.service';

@Module({
    imports: [],
    controllers: [FavoritesController],
    providers: [FavoritesService, PrismaService],
    exports: [FavoritesService],
})
export class FavoritesModule { }
