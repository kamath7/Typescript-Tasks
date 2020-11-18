import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authcredentialsDto);
  }
  async signIn(
    authcredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authcredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT token  `)
    return { accessToken };
  }
}

//JWT Token

/*
a) Header - Metadata about token
b)PayLoad - Claims
c) Signature - Result of encoded header
*/
