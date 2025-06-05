import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Card } from '@prisma/client';
import { CreateCardDto, UpdateCardDto } from './dtos/card.dto';

@Injectable()
export class CardService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateCardDto): Promise<Card> {
        console.log('🔄 CardService.create - dados recebidos:', data);

        const userExists = await this.prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!userExists) {
            throw new NotFoundException(`Usuário com ID ${data.userId} não encontrado`);
        }

        try {
            console.log('📅 Convertendo data:', {
                original: data.expiresDate,
                type: typeof data.expiresDate
            });

            const expiresDate = new Date(data.expiresDate);

            if (isNaN(expiresDate.getTime())) {
                throw new Error(`Data inválida: ${data.expiresDate}`);
            }

            console.log('✅ Data convertida:', expiresDate.toISOString());

            const card = await this.prisma.card.create({
                data: {
                    nameCard: data.nameCard,
                    cardNumber: data.cardNumber,
                    expiresDate: expiresDate,
                    securityCode: data.securityCode,
                    userId: data.userId,
                },
            });

            console.log('✅ Cartão criado:', card);
            return card;

        } catch (error) {
            console.error('❌ Erro ao criar cartão:', error);
            throw error;
        }
    }

    async edit(cardId: string, data: UpdateCardDto): Promise<Card> {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
        });

        if (!card) {
            throw new NotFoundException(`Cartão com ID ${cardId} não encontrado`);
        }

        // Preparar dados para atualização
        const updateData: any = {};

        if (data.nameCard) updateData.nameCard = data.nameCard;
        if (data.cardNumber) updateData.cardNumber = data.cardNumber;
        if (data.securityCode) updateData.securityCode = data.securityCode;
        if (data.expiresDate) updateData.expiresDate = new Date(data.expiresDate);
        if (data.userId) updateData.userId = data.userId;

        return this.prisma.card.update({
            where: { id: cardId },
            data: updateData,
        });
    }

    async findAll(): Promise<Card[]> {
        return this.prisma.card.findMany({
            include: { user: true },
        });
    }

    async findByUser(userId: string): Promise<Card[]> {
        return this.prisma.card.findMany({
            where: { userId },
        });
    }

    async delete(cardId: string): Promise<void> {
        await this.prisma.card.delete({
            where: { id: cardId },
        });
    }
}