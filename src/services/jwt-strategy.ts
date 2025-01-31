import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtService} from './jwt.service';

export class JwtStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.JwtService') private readonly jwtService: JwtService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractToken(request);
    if (!token) throw new Error('Token not found');

    try {
      return this.jwtService.verifyToken(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;
  }
}
