import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {JwtService} from '../services/jwt.service';
import {WebSocketService} from '../services/websocket.service';
export class AuthController {
  constructor(
    @repository(UserRepository) private readonly userRepository: UserRepository,
    @inject('services.JwtService') private readonly jwtService: JwtService,
    @inject('services.WebSocketService')
    private readonly webSocketService: WebSocketService,
  ) {}

  @post('/login')
  async login(
    @requestBody() credentials: {email: string; password: string},
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!user) {
      throw new Error('User not found');
    }
    const userProfile = {id: user.id, email: user.email};
    const token = this.jwtService.generateToken(userProfile);
    return {token};
  }
  @post('/send-message')
  @response(200, {description: 'Send a message to WebSocket clients'})
  async sendMessage(@requestBody() message: {text: string}): Promise<void> {
    this.webSocketService.sendMessage(message.text);
  }
}
