import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { User } from "@prisma/client";
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

        await this.subscription.create(user.id, data.plan);

        return user;
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
