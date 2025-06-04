import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) { }

    async signIn(data: LoginDto): Promise<Omit<User, 'password'> & { isSubscribed: boolean }> {
        try {
            const user = await this.userService.findUser({ email: data.email });

            const validatePass = await bcrypt.compare(data.password, user.password);

            if (!validatePass) {
                throw new UnauthorizedException('Invalid Credentials');
            }

            return {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isSubscribed: user.Subscription ? true : false,
            }
        } catch (err) {
            throw new HttpException(
                {
                    message: 'An error occurred during validation login',
                    error: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}