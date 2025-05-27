import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProfileDto) {
        const count = await this.prisma.profile.count({ where: { userId: dto.userId } });
        if (count >= 5) {
            throw new HttpException('Máximo de 5 perfis atingido.', HttpStatus.BAD_REQUEST);
        }

        return this.prisma.profile.create({ data: dto });
    }

    async update(id: string, data: UpdateProfileDto) {
        return this.prisma.profile.update({ where: { id }, data });
    }

    async delete(id: string) {
        return this.prisma.profile.delete({ where: { id } });
    }

    async findByUser(userId: string) {
        return this.prisma.profile.findMany({ where: { userId } });
    }
}