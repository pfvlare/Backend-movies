import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post()
    create(@Body() body: { name: string; color: string; userId: string }) {
        return this.profileService.create(body.name, body.color, body.userId);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.profileService.findByUser(userId);
    }

    @Put(':profileId')
    update(
        @Param('profileId') id: string,
        @Body() body: { name: string; color: string }
    ) {
        return this.profileService.update(id, body.name, body.color);
    }

    @Delete(':profileId')
    delete(@Param('profileId') profileId: string) {
        return this.profileService.delete(profileId);
    }
}
