import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../database/prisma.service';

@Module({
    imports: [],
    controllers: [SubscriptionController],
    providers: [SubscriptionService, PrismaService],
    exports: [SubscriptionService],
})
export class SubscriptionModule { }
