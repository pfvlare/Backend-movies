import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: Prisma.UserUncheckedCreateInput): Promise<User> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10)

            const user = await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashPassword
                }
            })

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
                    name: true,
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