import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { SubscriptionService } from "../subscription/subscription.service";
import { CreateUserDto } from "./dtos/createUser.dto";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private subscription: SubscriptionService
    ) { }

    async createUser(data: CreateUserDto): Promise<User> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10)
            const subscriptionData = {
                plan: data.Subscription.plan,
                value: data.Subscription.value,
                registeredAt: new Date().toDateString(),
                expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toDateString()
            }

            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone: data.phone,
                    address: data.address,
                    password: hashPassword
                }
            })

            if (user) {
                const subscription = await this.subscription.create({
                    ...subscriptionData,
                    userId: user.id
                })
            }

            return user
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException(
                        'This email is already in use. Please use another email.',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            throw new HttpException(
                `Error creating user. ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
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
                },
            });

            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }

            return user;
        } catch (err) {
            throw new HttpException(
                { message: 'An error occurred during login', error: err },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}