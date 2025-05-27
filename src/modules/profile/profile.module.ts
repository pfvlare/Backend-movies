import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService],
    exports: [ProfileService],
})
export class SubscriptionModule { }
