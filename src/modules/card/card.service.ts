import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Card } from '@prisma/client';
import { CardDto } from './dtos/card.dto';

@Injectable()
export class CardService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CardDto): Promise<Card> {
        return this.prisma.card.create({
            data: {
                nameCard: data.nameCard,
                cardNumber: data.cardNumber,
                expiresDate: new Date(data.expiresDate),
                securityCode: data.securityCode,
                user: {
                    connect: { id: data.userId },
                },
            },
        });
    }

    async edit(userId: string, data: CardDto): Promise<Card> {
        return this.prisma.card.update({
            where: {
                userId
            },
            data
        })
    }

    async findAll(): Promise<Card[]> {
        return this.prisma.card.findMany({
            include: {
                user: true,
            },
        });
    }

    async findByUserId(userId: string): Promise<Card | null> {
        return this.prisma.card.findUnique({
            where: { userId },
        });
    }

    async deleteByUserId(userId: string): Promise<Card> {
        const existing = await this.findByUserId(userId);
        if (!existing) {
            throw new NotFoundException(`Card not found for userId: ${userId}`);
        }

        return this.prisma.card.delete({
            where: { userId },
        });
    }
}
