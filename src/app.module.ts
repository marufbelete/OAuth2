import { Module } from '@nestjs/common';
import { OAuthModule } from './OAuth/OAuth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OAuthModule,
    PrismaModule,
  ],
})
export class AppModule {
  constructor() {}
}
