import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from '@nestjs/common';
import { OAuthService } from './OAuth.service';
import { ClientKeyResponseDto, TokenDto, TokenResponseDto, VerifyTokenDto, VerifyTokenResponseDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@Controller('oauth')
@ApiTags('OAuth')

export class OAuthController {
  constructor(
    private oauthService: OAuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('key')
  async getClientKeys(): Promise<ClientKeyResponseDto> {
    const result = await this.oauthService.getClientSecretAndId();
    return new ClientKeyResponseDto(result);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('token')
  async getToken(@Body() payload:TokenDto): Promise<TokenResponseDto> {
    const result = await this.oauthService.getAccessToken(payload);
    return new TokenResponseDto(result);
  }

  @HttpCode(HttpStatus.OK)
  @Get('validate/:token')
  async verifyToken(@Param() param:VerifyTokenDto): Promise<VerifyTokenResponseDto> {
    const result = await this.oauthService.validateToken(param.token);
    return new VerifyTokenResponseDto(result);
  }
  
}
