import { Controller, Post, Get, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionDto, SubscriptionReqDto } from './dtos/subscription.dto'
import { Plan, Prisma, Subscription } from '@prisma/client'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger'

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
