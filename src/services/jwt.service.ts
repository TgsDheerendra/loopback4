import {BindingScope, injectable} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  private readonly secretKey = 'secretKey123'; // Use ENV in real apps

  generateToken(userProfile: any): string {
    const payload = {
      id: userProfile.id,
      email: userProfile.email,
    };
    return jwt.sign(payload, this.secretKey, {expiresIn: '1h'});
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey) as UserProfile;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
