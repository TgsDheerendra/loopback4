import {UserService} from '@loopback/authentication';
import {Credentials} from '@loopback/authentication-jwt';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepo.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // const passwordMatched = await bcrypt.compare(
    //   credentials.password,
    //   foundUser.password,
    // );
    // if (!passwordMatched) {
    //   throw new Error('Invalid credentials');
    // }
    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id?.toString() || '',
      id: user.id,
      email: user.email,
    };
  }
}
