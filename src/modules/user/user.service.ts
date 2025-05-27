import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { SubscriptionService } from "../subscription/subscription.service";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UserResponseDto } from "./dtos/userResponse.dto";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private subscription: SubscriptionService
    ) { }

    async createUser(data: CreateUserDto): Promise<UserResponseDto> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10);
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 12)

            const user = await this.prisma.user.create({
                data: {
                    email: data.email.toLowerCase(),
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    address: data.address,
                    password: hashPassword
                },
                select: {
                    id: true,
                    email: true,
                    firstname: true,
                    lastname: true,
                    phone: true,
                    address: true
                }
            });

            await this.subscription.create(
                user.id,
                {
                    plan: data.subscription.plan,
                    value: data.subscription.value,
                    expiresAt: expiresAt.toISOString(),
                    registeredAt: new Date().toISOString()
                }
            );

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException(
                        'Este e-mail já está em uso. Tente outro.',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            throw new HttpException(
                `Erro ao criar usuário: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
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
                    Subscription: true
                },
            });

            if (!user) {
                throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
            }

            return user;
        } catch (err) {
            throw new HttpException(
                { message: 'Erro ao tentar login', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
