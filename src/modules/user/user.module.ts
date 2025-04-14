import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: [UserService],
})
export class UserModule { }
