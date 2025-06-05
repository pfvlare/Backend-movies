import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Plan } from '@prisma/client';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    // Mapear limites de perfis por plano corretamente
    private getPlanLimits(plan: Plan): number {
        const limits = {
            [Plan.basic]: 1,        // Plano básico: 1 perfil
            [Plan.intermediary]: 2, // Plano padrão: 2 perfis
            [Plan.complete]: 4,     // Plano premium: 4 perfis
        };

        return limits[plan] || 1; // Default: 1 perfil
    }

    async create(createProfileDto: CreateProfileDto) {
        try {
            console.log('🔄 Criando perfil:', createProfileDto);

            const { name, color, userId } = createProfileDto;

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
                maxProfiles = this.getPlanLimits(user.Subscription.plan);
                console.log('📊 Limites do plano:', {
                    plan: user.Subscription.plan,
                    maxProfiles,
                    currentProfiles: user.Profile.length
                });
            }

            // Verificar se o usuário já atingiu o limite de perfis
            const existingProfilesCount = user.Profile.length;

            if (existingProfilesCount >= maxProfiles) {
                throw new BadRequestException({
                    message: `Limite de ${maxProfiles} perfil${maxProfiles > 1 ? 's' : ''} atingido para o plano ${user.Subscription?.plan || 'básico'}`,
                    currentProfiles: existingProfilesCount,
                    maxProfiles,
                    plan: user.Subscription?.plan || 'none'
                });
            }

            // Verificar se já existe um perfil com o mesmo nome para este usuário
            const existingName = await this.prisma.profile.findFirst({
                where: {
                    userId,
                    name: {
                        equals: name.trim(),
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

            console.log('✅ Perfil criado:', profile);
            return profile;

        } catch (error) {
            console.error('❌ Erro ao criar perfil:', error);

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
            console.log('🔍 Buscando perfis para userId:', userId);

            // Verificar se o usuário existe
            const user = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            const profiles = await this.prisma.profile.findMany({
                where: { userId },
                orderBy: { name: 'asc' } // Ordenar por nome
            });

            console.log('✅ Perfis encontrados:', profiles.map(p => ({ id: p.id, name: p.name, color: p.color })));
            return profiles;

        } catch (error) {
            console.error('❌ Erro ao buscar perfis:', error);
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
            console.error('❌ Erro ao buscar perfil:', error);
            throw error;
        }
    }

    async update(id: string, updateProfileDto: UpdateProfileDto) {
        try {
            console.log('✏️ Atualizando perfil:', { id, updateProfileDto });

            const { name, color } = updateProfileDto;

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

            console.log('✅ Perfil atualizado:', updatedProfile);
            return updatedProfile;

        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error);

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
            console.log('🗑️ Excluindo perfil:', profileId);

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

            const deletedProfile = await this.prisma.profile.delete({
                where: { id: profileId },
            });

            console.log('✅ Perfil excluído:', deletedProfile);
            return deletedProfile;

        } catch (error) {
            console.error('❌ Erro ao excluir perfil:', error);
            throw error;
        }
    }

    async getUserProfileLimits(userId: string) {
        try {
            console.log('🔍 Buscando limites para userId:', userId);

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
            let planName = 'basic';

            if (user.Subscription) {
                maxProfiles = this.getPlanLimits(user.Subscription.plan);
                planName = user.Subscription.plan;
            }

            const result = {
                currentProfiles: user.Profile.length,
                maxProfiles,
                canCreateMore: user.Profile.length < maxProfiles,
                plan: planName
            };

            console.log('✅ Limites encontrados:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro ao buscar limites:', error);
            throw error;
        }
    }

    // Método para aplicar limites quando o plano muda
    async enforceProfileLimits(userId: string) {
        try {
            console.log('🔧 Aplicando limites de perfil para usuário:', userId);

            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Subscription: true,
                    Profile: {
                        orderBy: { name: 'asc' } // Ordenar por nome em vez de createdAt
                    }
                }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            const maxProfiles = user.Subscription
                ? this.getPlanLimits(user.Subscription.plan)
                : 1;

            const currentProfiles = user.Profile;

            if (currentProfiles.length <= maxProfiles) {
                console.log('✅ Perfis dentro do limite');
                return {
                    removedProfiles: [],
                    remainingProfiles: currentProfiles
                };
            }

            // Remover perfis em excesso (manter os primeiros por ordem alfabética)
            const profilesToKeep = currentProfiles.slice(0, maxProfiles);
            const profilesToRemove = currentProfiles.slice(maxProfiles);

            console.log(`🔄 Removendo ${profilesToRemove.length} perfil(s) em excesso`);

            const removedProfiles: any[] = [];
            for (const profile of profilesToRemove) {
                try {
                    const removed = await this.prisma.profile.delete({
                        where: { id: profile.id }
                    });
                    removedProfiles.push(removed);
                    console.log(`✅ Perfil removido: ${profile.name}`);
                } catch (error) {
                    console.error(`❌ Erro ao remover perfil ${profile.name}:`, error);
                }
            }

            return {
                removedProfiles,
                remainingProfiles: profilesToKeep
            };

        } catch (error) {
            console.error('❌ Erro ao aplicar limites:', error);
            throw error;
        }
    }
}