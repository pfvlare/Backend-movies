import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [UserModule, AuthModule, MovieModule, FavoritesModule, SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
