import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'milky-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
        forwardRef(() => UserModule), // Evita dependência circular
    ],
    providers: [AuthService, PrismaService, JwtStrategy],
    controllers: [AuthController],
    exports: [forwardRef(() => AuthService)], // Exporta AuthService corretamente
})
export class AuthModule { }
