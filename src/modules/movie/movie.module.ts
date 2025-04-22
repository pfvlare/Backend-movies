import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
    imports: [],
    controllers: [MovieController],
    providers: [MovieService, PrismaService],
    exports: [],
})
export class MovieModule { }
