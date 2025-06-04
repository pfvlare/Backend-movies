import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, Subscription, User } from "@prisma/client";
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
        const hashPassword = await bcrypt.hash(data.password, 10);

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

        await this.subscription.create(
            user.id,
            {
                plan: data.subscription.plan,
                value: data.subscription.value,
            }
        );

        return user;
    }

    async findUser(where: Prisma.UserWhereUniqueInput): Promise<User & { Subscription: Subscription | null }> {
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
