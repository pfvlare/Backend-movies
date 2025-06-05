import {
    Injectable,
    HttpException,
    HttpStatus,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Subscription, Prisma, Plan } from '@prisma/client';
import { SubscriptionDto, SubscriptionReqDto } from './dtos/subscription.dto';

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: SubscriptionReqDto): Promise<Subscription> {
        try {
            console.log('🔄 Criando subscription:', { userId, dto });

            // Verificar se já existe uma subscription para este usuário
            const existingSubscription = await this.findByUserId(userId);
            if (existingSubscription) {
                console.log('⚠️ Subscription já existe, atualizando...');
                return this.update(userId, {
                    plan: dto.plan,
                    value: dto.value
                });
            }

            // Validar dados
            this.validateSubscriptionData(dto);

            const subscription = await this.prisma.subscription.create({
                data: {
                    plan: dto.plan,
                    value: Number(dto.value),
                    registeredAt: new Date(),
                    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    user: { connect: { id: userId } },
                },
                include: {
                    user: true
                }
            });

            console.log('✅ Subscription criada:', subscription);
            return subscription;

        } catch (error) {
            console.error('❌ Erro ao criar subscription:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            if (error.code === 'P2002') {
                throw new BadRequestException('Usuário já possui uma assinatura ativa');
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Usuário não encontrado');
            }

            throw new HttpException(
                {
                    message: 'Erro interno ao criar assinatura',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(): Promise<Subscription[]> {
        try {
            return this.prisma.subscription.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstname: true,
                            lastname: true
                        }
                    },
                },
                orderBy: {
                    registeredAt: 'desc'
                }
            });
        } catch (error) {
            console.error('❌ Erro ao buscar todas as subscriptions:', error);
            throw new HttpException(
                'Erro ao buscar assinaturas',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByUserId(userId: string): Promise<Subscription | null> {
        try {
            console.log('🔍 Buscando subscription para userId:', userId);

            if (!userId) {
                throw new BadRequestException('UserId é obrigatório');
            }

            const subscription = await this.prisma.subscription.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                },
            });

            console.log('✅ Subscription encontrada:', subscription ? 'Sim' : 'Não');
            return subscription;

        } catch (error) {
            console.error('❌ Erro ao buscar subscription:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                'Erro ao buscar assinatura',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(userId: string, data: Partial<SubscriptionReqDto>): Promise<Subscription> {
        try {
            console.log('🔄 Atualizando subscription:', { userId, data });

            if (!userId) {
                throw new BadRequestException('UserId é obrigatório');
            }

            // Verificar se a subscription existe
            const existingSubscription = await this.findByUserId(userId);
            if (!existingSubscription) {
                console.log('⚠️ Subscription não existe, criando nova...');
                if (!data.plan || data.value === undefined) {
                    throw new BadRequestException('Plan e value são obrigatórios para criar nova assinatura');
                }
                return this.create(userId, data as SubscriptionReqDto);
            }

            // Preparar dados para atualização
            const updateData: any = {};

            if (data.plan) {
                // Validar o plano antes de atualizar
                this.validatePlan(data.plan);
                updateData.plan = data.plan;
            }

            if (data.value !== undefined) {
                updateData.value = Number(data.value);
                if (isNaN(updateData.value) || updateData.value <= 0) {
                    throw new BadRequestException('Valor deve ser um número maior que 0');
                }
            }

            // Renovar por mais 1 ano se estiver atualizando o plano
            if (data.plan) {
                updateData.expiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            }

            const updatedSubscription = await this.prisma.subscription.update({
                where: { userId },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                }
            });

            console.log('✅ Subscription atualizada:', updatedSubscription);
            return updatedSubscription;

        } catch (error) {
            console.error('❌ Erro ao atualizar subscription:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            if (error.code === 'P2025') {
                // Record not found - tentar criar nova subscription
                console.log('⚠️ Record não encontrado, tentando criar nova subscription...');
                if (!data.plan || data.value === undefined) {
                    throw new NotFoundException('Assinatura não encontrada e dados insuficientes para criar nova');
                }
                return this.create(userId, data as SubscriptionReqDto);
            }

            throw new HttpException(
                {
                    message: 'Erro ao atualizar assinatura',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async remove(userId: string): Promise<Subscription> {
        try {
            console.log('🗑️ Removendo subscription:', userId);

            if (!userId) {
                throw new BadRequestException('UserId é obrigatório');
            }

            // Verificar se a subscription existe
            const existingSubscription = await this.findByUserId(userId);
            if (!existingSubscription) {
                throw new NotFoundException('Assinatura não encontrada');
            }

            const deletedSubscription = await this.prisma.subscription.delete({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                }
            });

            console.log('✅ Subscription removida:', deletedSubscription);
            return deletedSubscription;

        } catch (error) {
            console.error('❌ Erro ao remover subscription:', error);

            if (error instanceof HttpException) {
                throw error;
            }

            if (error.code === 'P2025') {
                throw new NotFoundException('Assinatura não encontrada');
            }

            throw new HttpException(
                {
                    message: 'Erro ao cancelar assinatura',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Método para upsert (create ou update)
    async upsert(userId: string, dto: SubscriptionReqDto): Promise<Subscription> {
        try {
            console.log('🔄 Upsert subscription:', { userId, dto });

            const existingSubscription = await this.findByUserId(userId);

            if (existingSubscription) {
                console.log('📝 Subscription existe, atualizando...');
                return this.update(userId, dto);
            } else {
                console.log('➕ Subscription não existe, criando...');
                return this.create(userId, dto);
            }

        } catch (error) {
            console.error('❌ Erro no upsert:', error);
            throw error;
        }
    }

    private validateSubscriptionData(dto: SubscriptionReqDto): void {
        console.log('🔍 Validating subscription data:', dto);

        if (!dto.plan) {
            throw new BadRequestException('Plano é obrigatório');
        }

        this.validatePlan(dto.plan);

        if (dto.value === undefined || dto.value === null) {
            throw new BadRequestException('Valor é obrigatório');
        }

        const numValue = Number(dto.value);
        if (isNaN(numValue) || numValue <= 0) {
            throw new BadRequestException('Valor deve ser um número maior que 0');
        }
    }

    private validatePlan(plan: Plan): void {
        const validPlans = Object.values(Plan);
        console.log('🔍 Plan validation:', {
            receivedPlan: plan,
            planType: typeof plan,
            validPlans: validPlans,
            isValid: validPlans.includes(plan)
        });

        if (!validPlans.includes(plan)) {
            throw new BadRequestException(`Plano inválido: ${plan}. Planos válidos: ${validPlans.join(', ')}`);
        }
    }

    private getPlanPrice(plan: Plan): number {
        switch (plan) {
            case Plan.basic:
                return 18.9;
            case Plan.intermediary:
                return 39.9;
            case Plan.complete:
                return 55.9;
            default:
                return 0;
        }
    }

    // Método helper para verificar se assinatura está ativa
    isSubscriptionActive(subscription: Subscription): boolean {
        if (!subscription) return false;
        return new Date(subscription.expiresAt) > new Date();
    }

    // Método para renovar assinatura
    async renew(userId: string, months: number = 12): Promise<Subscription> {
        try {
            const subscription = await this.findByUserId(userId);
            if (!subscription) {
                throw new NotFoundException('Assinatura não encontrada');
            }

            const currentExpiry = new Date(subscription.expiresAt);
            const newExpiry = new Date(currentExpiry);
            newExpiry.setMonth(newExpiry.getMonth() + months);

            return this.update(userId, {
                expiresAt: newExpiry.toISOString()
            } as any);

        } catch (error) {
            console.error('❌ Erro ao renovar subscription:', error);
            throw error;
        }
    }
}