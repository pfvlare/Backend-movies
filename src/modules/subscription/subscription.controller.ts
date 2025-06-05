import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    UsePipes
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto, SubscriptionReqDto } from './dtos/subscription.dto';
import { Plan, Subscription } from '@prisma/client';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post('user/:userId')
    @ApiOperation({ summary: 'Criar nova assinatura para usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiBody({
        type: SubscriptionReqDto,
        description: 'Dados da assinatura',
        examples: {
            basic: {
                summary: 'Plano Básico',
                value: {
                    plan: 'BASIC',
                    value: 18.90
                }
            },
            intermediary: {
                summary: 'Plano Padrão',
                value: {
                    plan: 'INTERMEDIARY',
                    value: 39.90
                }
            },
            complete: {
                summary: 'Plano Premium',
                value: {
                    plan: 'COMPLETE',
                    value: 55.90
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Assinatura criada com sucesso',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos ou usuário já possui assinatura'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor'
    })
    async create(
        @Param('userId') userId: string,
        @Body() subscriptionDto: SubscriptionReqDto
    ): Promise<Subscription> {
        console.log('🔄 POST /subscriptions/user/:userId', { userId, body: subscriptionDto });
        return this.subscriptionService.create(userId, subscriptionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as assinaturas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de assinaturas retornada com sucesso',
        type: [SubscriptionDto]
    })
    @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor'
    })
    async findAll(): Promise<Subscription[]> {
        console.log('🔍 GET /subscriptions');
        return this.subscriptionService.findAll();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Buscar assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 200,
        description: 'Assinatura encontrada',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 404,
        description: 'Assinatura não encontrada'
    })
    @ApiResponse({
        status: 400,
        description: 'UserId inválido'
    })
    async findByUserId(@Param('userId') userId: string): Promise<Subscription | null> {
        console.log('🔍 GET /subscriptions/user/:userId', { userId });
        return this.subscriptionService.findByUserId(userId);
    }

    @Put('user/:userId')
    @ApiOperation({ summary: 'Atualizar assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiBody({
        description: 'Dados para atualização (todos os campos são opcionais)',
        examples: {
            updatePlan: {
                summary: 'Atualizar apenas o plano',
                value: {
                    plan: 'COMPLETE'
                }
            },
            updateValue: {
                summary: 'Atualizar apenas o valor',
                value: {
                    value: 55.90
                }
            },
            updateBoth: {
                summary: 'Atualizar plano e valor',
                value: {
                    plan: 'COMPLETE',
                    value: 55.90
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Assinatura atualizada com sucesso',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 404,
        description: 'Assinatura não encontrada'
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos'
    })
    async update(
        @Param('userId') userId: string,
        @Body() data: Partial<SubscriptionReqDto>
    ): Promise<Subscription> {
        console.log('🔄 PUT /subscriptions/user/:userId', { userId, body: data });
        return this.subscriptionService.update(userId, data);
    }

    @Delete('user/:userId')
    @HttpCode(HttpStatus.OK) // Retorna 200 com o objeto deletado
    @ApiOperation({ summary: 'Cancelar assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 200,
        description: 'Assinatura cancelada com sucesso',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 404,
        description: 'Assinatura não encontrada'
    })
    @ApiResponse({
        status: 400,
        description: 'UserId inválido'
    })
    async remove(@Param('userId') userId: string): Promise<Subscription> {
        console.log('🗑️ DELETE /subscriptions/user/:userId', { userId });
        return this.subscriptionService.remove(userId);
    }

    // Endpoint adicional para upsert (criar ou atualizar)
    @Post('user/:userId/upsert')
    @ApiOperation({ summary: 'Criar ou atualizar assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiBody({
        type: SubscriptionReqDto,
        description: 'Dados da assinatura'
    })
    @ApiResponse({
        status: 200,
        description: 'Assinatura processada com sucesso',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos'
    })
    async upsert(
        @Param('userId') userId: string,
        @Body() subscriptionDto: SubscriptionReqDto
    ): Promise<Subscription> {
        console.log('🔄 POST /subscriptions/user/:userId/upsert', { userId, body: subscriptionDto });
        return this.subscriptionService.upsert(userId, subscriptionDto);
    }

    // Endpoint para renovar assinatura
    @Post('user/:userId/renew')
    @ApiOperation({ summary: 'Renovar assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                months: {
                    type: 'number',
                    example: 12,
                    description: 'Número de meses para renovar (padrão: 12)'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Assinatura renovada com sucesso',
        type: SubscriptionDto
    })
    @ApiResponse({
        status: 404,
        description: 'Assinatura não encontrada'
    })
    async renew(
        @Param('userId') userId: string,
        @Body('months') months: number = 12
    ): Promise<Subscription> {
        console.log('🔄 POST /subscriptions/user/:userId/renew', { userId, months });
        return this.subscriptionService.renew(userId, months);
    }

    // Endpoint para verificar status da assinatura
    @Get('user/:userId/status')
    @ApiOperation({ summary: 'Verificar status da assinatura do usuário' })
    @ApiParam({
        name: 'userId',
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 200,
        description: 'Status da assinatura',
        schema: {
            type: 'object',
            properties: {
                hasSubscription: { type: 'boolean' },
                isActive: { type: 'boolean' },
                plan: { type: 'string', enum: Object.values(Plan) },
                expiresAt: { type: 'string', format: 'date-time' },
                daysUntilExpiry: { type: 'number' }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    async getStatus(@Param('userId') userId: string) {
        console.log('🔍 GET /subscriptions/user/:userId/status', { userId });

        const subscription = await this.subscriptionService.findByUserId(userId);

        if (!subscription) {
            return {
                hasSubscription: false,
                isActive: false,
                plan: null,
                expiresAt: null,
                daysUntilExpiry: 0
            };
        }

        const isActive = this.subscriptionService.isSubscriptionActive(subscription);
        const daysUntilExpiry = Math.ceil(
            (new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            hasSubscription: true,
            isActive,
            plan: subscription.plan,
            expiresAt: subscription.expiresAt,
            daysUntilExpiry: Math.max(0, daysUntilExpiry)
        };
    }
}