import { Controller, Post, Get, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionDto } from './dtos/subscription.dto'
import { Prisma } from '@prisma/client'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post('user/:userId')
        async create(
            @Param('userId') userId: string, // ← troquei aqui
            @Body() dto: SubscriptionDto,
            ) {
        return this.subscriptionService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as assinaturas' })
    @ApiResponse({ status: 200, description: 'Lista de assinaturas retornada com sucesso' })
    findAll() {
        return this.subscriptionService.findAll()
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Busca uma assinatura pelo ID do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Assinatura do usuário retornada com sucesso' })
    findByUserId(@Param('userId') userId: string) {
        return this.subscriptionService.findByUserId(userId)
    }

    @Put('user/:userId')
    @ApiOperation({ summary: 'Atualiza uma assinatura do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiBody({ type: SubscriptionDto })
    @ApiResponse({ status: 200, description: 'Assinatura atualizada com sucesso' })
    update(@Param('userId') userId: string, @Body() data: Prisma.SubscriptionUpdateInput) {
        return this.subscriptionService.update(userId, data)
    }

    @Delete('user/:userId')
    @ApiOperation({ summary: 'Remove a assinatura do usuário' })
    @ApiParam({ name: 'userId', description: 'UUID do usuário' })
    @ApiResponse({ status: 200, description: 'Assinatura removida com sucesso' })
    remove(@Param('userId') userId: string) {
        return this.subscriptionService.remove(userId)
    }
}
