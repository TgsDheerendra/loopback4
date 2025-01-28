import {BindingScope, injectable} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  private readonly secretKey = 'TestdheerendraWithNewThing'; // Replace with a secure secret key
  // Method to generate a JWT token
  generateToken(userProfile: UserProfile): string {
    const payload = {
      id: userProfile.id,
      name: userProfile.name,
    };
    return jwt.sign(payload, this.secretKey, {expiresIn: '1h'});
  }
  verifyToken(token: string): UserProfile {
    try {
      const decoded = jwt.verify(token, this.secretKey) as UserProfile;
      return decoded;
    } catch (err) {
      console.error('Error verifying token:', err);
      throw new Error('Invalid token'); // Ensure error is thrown for invalid tokens
    }
  }
}
