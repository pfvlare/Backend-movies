import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Subscription, Plan } from '@prisma/client';

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, plan: Plan): Promise<Subscription> {
        return this.prisma.subscription.create({
            data: {
                plan,
                value: this.getPlanPrice(plan),
                registeredAt: new Date(),
                expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                user: { connect: { id: userId } },
            },
        });
    }

    async findAll(): Promise<Subscription[]> {
        return this.prisma.subscription.findMany({
            include: {
                user: true,
            },
        });
    }

    async findByUserId(userId: string): Promise<Subscription | null> {
        return this.prisma.subscription.findUnique({
            where: { userId },
            include: { user: true },
        });
    }

    async update(userId: string, data: Partial<Subscription>): Promise<Subscription> {
        return this.prisma.subscription.update({
            where: { userId },
            data,
        });
    }

    async remove(userId: string): Promise<Subscription> {
        return this.prisma.subscription.delete({
            where: { userId },
        });
    }

    private getPlanPrice(plan: Plan): number {
        switch (plan) {
            case Plan.basic:
                return 19.9;
            case Plan.intermediary:
                return 29.9;
            case Plan.complete:
                return 39.9;
            default:
                return 0;
        }
    }
}
