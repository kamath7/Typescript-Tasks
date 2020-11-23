import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private logger;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    signUp(authcredentialsDto: AuthCredentialsDto): Promise<void>;
    signIn(authcredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
