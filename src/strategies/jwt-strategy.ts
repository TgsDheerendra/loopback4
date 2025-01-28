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
      // If token is missing, throw a specific error to indicate it's missing
      throw new Error('Token not found');
    }

    try {
      // Verify and extract user profile from the token
      return this.jwtService.verifyToken(token);
    } catch (error) {
      // If token verification fails (invalid or expired token), throw a specific error
      throw new Error('Invalid token'); // Or another custom error message
    }
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request?.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Return the token part of the header
    }
    return undefined;
  }
}
