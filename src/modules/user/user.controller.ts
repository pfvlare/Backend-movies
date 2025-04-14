import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dtos/user.dto";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async signUp(@Body() userData: CreateUserDto): Promise<User> {
        return this.userService.createUser(userData);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() signInData: { email: string; password: string },
    ): Promise<Omit<User, 'password'>> {
        return this.authService.signIn(signInData);
    }

}