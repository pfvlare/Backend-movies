import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
    imports: [],
    controllers: [CardController],
    providers: [CardService, PrismaService],
    exports: [],
})
export class CardModule { }
