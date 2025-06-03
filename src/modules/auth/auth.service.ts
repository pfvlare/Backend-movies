import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async signIn(data: LoginDto) {
        const user = await this.userService.findUserByEmail(data.email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordValid = await bcrypt.compare(data.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id };
        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                address: user.address,
            },
        };
    }

    async getUser(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phone: true,
                address: true,
            },
        });
    }
}
