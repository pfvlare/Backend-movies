import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async create(name: string, color: string, userId: string) {
        try {
            // Verificar se o usuário existe
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Subscription: true,
                    Profile: true
                }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            // Determinar limite de perfis baseado no plano
            let maxProfiles = 1; // Padrão para usuários sem assinatura

            if (user.Subscription) {
                switch (user.Subscription.plan) {
                    case 'basic':
                        maxProfiles = 1;
                        break;
                    case 'intermediary':
                        maxProfiles = 3;
                        break;
                    case 'complete':
                        maxProfiles = 5;
                        break;
                }
            }

            // Verificar se o usuário já atingiu o limite de perfis
            const existingProfilesCount = user.Profile.length;

            if (existingProfilesCount >= maxProfiles) {
                throw new BadRequestException(`Você pode ter no máximo ${maxProfiles} perfis com seu plano atual`);
            }

            // Verificar se já existe um perfil com o mesmo nome para este usuário
            const existingName = await this.prisma.profile.findFirst({
                where: {
                    userId,
                    name: {
                        equals: name,
                        mode: 'insensitive' // Case insensitive
                    }
                }
            });

            if (existingName) {
                throw new BadRequestException('Já existe um perfil com este nome');
            }

            // Verificar se já existe um perfil com a mesma cor para este usuário
            const existingColor = await this.prisma.profile.findFirst({
                where: { userId, color }
            });

            if (existingColor) {
                throw new BadRequestException('Já existe um perfil com esta cor');
            }

            // Criar o perfil
            const profile = await this.prisma.profile.create({
                data: {
                    name: name.trim(),
                    color,
                    userId
                },
            });

            return profile;
        } catch (error) {
            if (error.code === 'P2002') {
                // Unique constraint violation
                if (error.meta?.target?.includes('name')) {
                    throw new BadRequestException('Já existe um perfil com este nome');
                }
                if (error.meta?.target?.includes('color')) {
                    throw new BadRequestException('Já existe um perfil com esta cor');
                }
            }
            throw error;
        }
    }

    async findByUser(userId: string) {
        try {
            // Verificar se o usuário existe
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            return await this.prisma.profile.findMany({
                where: { userId },
                orderBy: { name: 'asc' }
            });
        } catch (error) {
            throw error;
        }
    }

    async findOne(profileId: string) {
        try {
            const profile = await this.prisma.profile.findUnique({
                where: { id: profileId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true
                        }
                    }
                }
            });

            if (!profile) {
                throw new NotFoundException('Perfil não encontrado');
            }

            return profile;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, name?: string, color?: string) {
        try {
            const profile = await this.prisma.profile.findUnique({
                where: { id },
                include: { user: true }
            });

            if (!profile) {
                throw new NotFoundException('Perfil não encontrado');
            }

            // Se o nome está sendo alterado, verificar se não conflita
            if (name && name.trim() !== profile.name) {
                const existingName = await this.prisma.profile.findFirst({
                    where: {
                        userId: profile.userId,
                        name: {
                            equals: name.trim(),
                            mode: 'insensitive'
                        },
                        id: { not: id } // Excluir o próprio perfil da busca
                    }
                });

                if (existingName) {
                    throw new BadRequestException('Já existe um perfil com este nome');
                }
            }

            // Se a cor está sendo alterada, verificar se não conflita
            if (color && color !== profile.color) {
                const existingColor = await this.prisma.profile.findFirst({
                    where: {
                        userId: profile.userId,
                        color,
                        id: { not: id } // Excluir o próprio perfil da busca
                    }
                });

                if (existingColor) {
                    throw new BadRequestException('Já existe um perfil com esta cor');
                }
            }

            // Atualizar o perfil
            const updatedProfile = await this.prisma.profile.update({
                where: { id },
                data: {
                    ...(name && { name: name.trim() }),
                    ...(color && { color })
                },
            });

            return updatedProfile;
        } catch (error) {
            if (error.code === 'P2002') {
                // Unique constraint violation
                if (error.meta?.target?.includes('name')) {
                    throw new BadRequestException('Já existe um perfil com este nome');
                }
                if (error.meta?.target?.includes('color')) {
                    throw new BadRequestException('Já existe um perfil com esta cor');
                }
            }
            throw error;
        }
    }

    async delete(profileId: string) {
        try {
            const profile = await this.prisma.profile.findUnique({
                where: { id: profileId }
            });

            if (!profile) {
                throw new NotFoundException('Perfil não encontrado');
            }

            // Verificar se não é o último perfil do usuário
            const userProfilesCount = await this.prisma.profile.count({
                where: { userId: profile.userId }
            });

            if (userProfilesCount <= 1) {
                throw new BadRequestException('Você precisa manter pelo menos 1 perfil');
            }

            return await this.prisma.profile.delete({
                where: { id: profileId },
            });
        } catch (error) {
            throw error;
        }
    }

    async getUserProfileLimits(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Subscription: true,
                    Profile: true
                }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            let maxProfiles = 1;

            if (user.Subscription) {
                switch (user.Subscription.plan) {
                    case 'basic':
                        maxProfiles = 1;
                        break;
                    case 'intermediary':
                        maxProfiles = 3;
                        break;
                    case 'complete':
                        maxProfiles = 5;
                        break;
                }
            }

            return {
                currentProfiles: user.Profile.length,
                maxProfiles,
                canCreateMore: user.Profile.length < maxProfiles,
                plan: user.Subscription?.plan || 'none'
            };
        } catch (error) {
            throw error;
        }
    }
}