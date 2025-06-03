import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Plan, Subscription } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post('user/:userId')
    create(@Param('userId') userId: string, @Body('plan') plan: Plan): Promise<Subscription> {
        return this.subscriptionService.create(userId, plan);
    }

    @Get()
    findAll(): Promise<Subscription[]> {
        return this.subscriptionService.findAll();
    }

    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string): Promise<Subscription | null> {
        return this.subscriptionService.findByUserId(userId);
    }

    @Put('user/:userId')
    update(
        @Param('userId') userId: string,
        @Body() data: Partial<Subscription>
    ): Promise<Subscription> {
        return this.subscriptionService.update(userId, data);
    }

    @Delete('user/:userId')
    remove(@Param('userId') userId: string): Promise<Subscription> {
        return this.subscriptionService.remove(userId);
    }
}
