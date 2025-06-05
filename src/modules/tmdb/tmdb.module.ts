import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TmdbController } from './tmdb.controller';
import { TmdbService } from './tmdb.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 15000,
            maxRedirects: 5,
        }),
        ConfigModule,
    ],
    controllers: [TmdbController],
    providers: [TmdbService],
    exports: [TmdbService],
})
export class TmdbModule { }