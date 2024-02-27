import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { payload } from './types';

@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private expiresIn = this.configService.get('TOKEN_EXPIRE');

  async getClientSecretAndId() {
    const clientId = this.generateRandomString(16);
    const clientSecret = this.generateRandomString(32);
    return this.prisma.user.create({
      data: {
        clientId,
        clientSecret,
      },
      select: {
        clientId: true,
        clientSecret: true,
      },
    });
  }

  //provide token
  async getAccessToken({clientId, clientSecret}:TokenDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        clientId,
        clientSecret,
      },
      select: {
        id:true,
        clientId: true,
        clientSecret: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    const token=this.jwtService.sign(
      { clientId: user.clientId },
      { secret: user.clientSecret, expiresIn: this.expiresIn },
    );
    await this.prisma.accessToken.upsert({
      where: { 
       userId:user.id
      },
      create: {
        token,
        user: {
          connect: { id: user.id },
        },
      },
      update: {
        token, 
      },
      select:{
        token:true
      }
    });
    return {token}

  }

  async validateToken(token:string){
   const decodedToken:payload=this.decodeToken(token)
    const user_token_info=await this.prisma.user.findFirst({
      where:{
        clientId:decodedToken.clientId,
        token:{
            token:token
        }
      },
      select:{
      id:true,
      clientSecret:true
      }
    })
    if (!user_token_info) {
      throw new UnauthorizedException('invalid token');
    }
    this.verifyToken(token,user_token_info.clientSecret)
    return{
      status:true
    }


  }

  generateRandomString(length: number) {
    return randomBytes(length).toString('hex');
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token,{json:true})
  }
  verifyToken(token: string, secret: string) {
      return this.jwtService.verify(token, { secret });
  }

}
