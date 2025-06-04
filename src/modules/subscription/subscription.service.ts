import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Subscription, Prisma } from '@prisma/client';
import { SubscriptionDto, SubscriptionReqDto } from './dtos/subscription.dto';

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: SubscriptionReqDto) {
        return this.prisma.subscription.create({
            data: {
                plan: dto.plan,
                value: Number(dto.value),
                registeredAt: new Date(),
                expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
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

    async update(userId: string, data: Prisma.SubscriptionUpdateInput): Promise<Subscription> {
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
}
