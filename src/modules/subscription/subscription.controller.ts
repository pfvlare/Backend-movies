import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './dtos/subscription.dto';
import { Prisma } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post()
    create(@Body() dto: SubscriptionDto) {
        return this.subscriptionService.create(dto);
    }

    @Get()
    findAll() {
        return this.subscriptionService.findAll();
    }

    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string) {
        return this.subscriptionService.findByUserId(userId);
    }

    @Put('user/:userId')
    update(@Param('userId') userId: string, @Body() data: Prisma.SubscriptionUpdateInput) {
        return this.subscriptionService.update(userId, data);
    }

    @Delete('user/:userId')
    remove(@Param('userId') userId: string) {
        return this.subscriptionService.remove(userId);
    }
}
