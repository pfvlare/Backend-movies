import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async create(name: string, color: string, userId: string) {
        return this.prisma.profile.create({
            data: { name, color, userId },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.profile.findMany({
            where: { userId },
        });
    }

    async delete(profileId: string) {
        return this.prisma.profile.delete({
            where: { id: profileId },
        });
    }

    async update(id: string, name: string, color: string) {
        return this.prisma.profile.update({
            where: { id },
            data: { name, color },
        });
    }
}
