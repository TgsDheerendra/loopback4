import {BindingScope, injectable} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  private readonly secret = 'TestdheerendraWithNewThing'; // Replace with a secure secret key

  generateToken(userProfile: UserProfile): string {
    return jwt.sign(
      {
        email: userProfile.email,
      },
      this.secret,
      {expiresIn: '1h'},
    );
  }

  verifyToken(token: string): UserProfile {
    try {
      const decoded = jwt.verify(token, this.secret) as UserProfile;
      console.log('Decoded token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error); // Log the error for better insight
      throw new Error('Invalid token');
    }
  }
}
