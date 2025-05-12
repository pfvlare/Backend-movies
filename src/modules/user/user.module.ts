import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
    imports: [forwardRef(() => AuthModule), SubscriptionModule],
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: [UserService],
})
export class UserModule { }
