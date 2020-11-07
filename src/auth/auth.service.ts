import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authcredentialsDto);
  }
  async signIn(authcredentialsDto: AuthCredentialsDto){
    const result = await this.userRepository.validateUserPassword(authcredentialsDto);
    console.log(result);
  }
}
