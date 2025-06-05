import {
    HttpException,
    HttpStatus,
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Subscription, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserResponseDto } from './dtos/userResponse.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private subscription: SubscriptionService,
    ) { }

    async createUser(data: CreateUserDto): Promise<UserResponseDto> {
        const hashPassword = await bcrypt.hash(data.password, 10);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email.toLowerCase(),
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    address: data.address,
                    password: hashPassword,
                },
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true,
                },
            });

            await this.subscription.create(user.id, {
                plan: data.subscription.plan,
                value: data.subscription.value,
            });

            return user;
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === 'P2002' &&
                Array.isArray(err.meta?.target) && err.meta?.target.includes('email')
            ) {
                throw new BadRequestException('Já existe um usuário com esse e-mail.');
            }

            throw new HttpException(
                { message: 'Erro ao criar usuário', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
        try {
            // Verificar se o usuário existe
            const existingUser = await this.prisma.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                throw new NotFoundException('Usuário não encontrado');
            }

            // Se está tentando atualizar email, verificar se já existe
            if (data.email && data.email !== existingUser.email) {
                const emailExists = await this.prisma.user.findUnique({
                    where: { email: data.email.toLowerCase() },
                });

                if (emailExists) {
                    throw new BadRequestException('Já existe um usuário com esse e-mail.');
                }
            }

            // Atualizar apenas os campos fornecidos
            const updateData: Partial<User> = {};
            if (data.email) updateData.email = data.email.toLowerCase();
            if (data.firstname) updateData.firstname = data.firstname;
            if (data.lastname) updateData.lastname = data.lastname;
            if (data.phone) updateData.phone = data.phone;
            if (data.address) updateData.address = data.address;

            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true,
                    Subscription: true,
                    Profile: true,
                },
            });

            return updatedUser;
        } catch (err) {
            if (err instanceof BadRequestException || err instanceof NotFoundException) {
                throw err;
            }

            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === 'P2002' &&
                Array.isArray(err.meta?.target) && err.meta?.target.includes('email')
            ) {
                throw new BadRequestException('Já existe um usuário com esse e-mail.');
            }

            throw new HttpException(
                { message: 'Erro ao atualizar usuário', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findUser(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<User & { Subscription: Subscription | null }> {
        try {
            const user = await this.prisma.user.findUnique({
                where,
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true,
                    password: true,
                    Subscription: true,
                    Profile: true
                },
            });

            if (!user) {
                throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
            }

            return user;
        } catch (err) {
            throw new HttpException(
                { message: 'Erro ao tentar login', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findById(id: string): Promise<UserResponseDto> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true,
                    Subscription: true,
                    Profile: true,
                },
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }

            return user;
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            }

            throw new HttpException(
                { message: 'Erro ao buscar usuário', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}