import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Card } from '@prisma/client';
import { CardDto } from './dtos/card.dto';

@Injectable()
export class CardService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CardDto): Promise<Card> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!userExists) {
            throw new NotFoundException(`Usuário com ID ${data.userId} não encontrado`);
        }

        return this.prisma.card.create({
            data: {
                nameCard: data.nameCard,
                cardNumber: data.cardNumber,
                expiresDate: new Date(data.expiresDate),
                securityCode: data.securityCode,
                userId: data.userId,
            },
        });
    }

    async edit(cardId: string, data: CardDto): Promise<Card> {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
        });

        if (!card) {
            throw new NotFoundException(`Cartão com ID ${cardId} não encontrado`);
        }

        return this.prisma.card.update({
            where: { id: cardId },
            data,
        });
    }

    async findAll(): Promise<Card[]> {
        return this.prisma.card.findMany({
            include: {
                user: true,
            },
        });
    }

    async findByUserId(userId: string): Promise<Card[]> {
        return this.prisma.card.findMany({
            where: { userId },
        });
    }

    async deleteByCardId(cardId: string): Promise<Card> {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
        });

        if (!card) {
            throw new NotFoundException(`Cartão com ID ${cardId} não encontrado`);
        }

        return this.prisma.card.delete({
            where: { id: cardId },
        });
    }
}
