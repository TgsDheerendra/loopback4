import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtService} from '../services/jwt.service';

export class JwtStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.JwtService') private readonly jwtService: JwtService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractToken(request);

    if (!token) {
      throw new Error('Token not found');
    }
    return this.jwtService.verifyToken(token);
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader); // Add this for debugging
    if (authHeader?.startsWith('Bearer ')) {
      throw new Error('Token not found');
      //return authHeader.split(' ')[1];
    }
    return undefined;
  }
}
