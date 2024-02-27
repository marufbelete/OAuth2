import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { OAuthService } from './OAuth.service';
import { OAuthController } from './OAuth.controller';
import { JwtModule } from '@nestjs/jwt/dist';



@Module({
  imports: [
    JwtModule.register({}),    
  ],
  //runs according to given sequence
  providers: [
    OAuthService,
  ],
  controllers: [OAuthController],
})
export class OAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
