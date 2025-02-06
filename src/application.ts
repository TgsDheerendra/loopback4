import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as http from 'http';
import path from 'path';
import {MysqlDbDataSource} from './datasources/mysql-db.datasource';
import {MySequence} from './sequence';
import {JwtStrategy} from './services/jwt-strategy';
import {JwtService} from './services/jwt.service';
import {MyUserService} from './services/user.service'; // Import the service
import {WebSocketService} from './services/websocket.service';
export {ApplicationConfig};

export class CountrymasterpocApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.dataSource(MysqlDbDataSource);
    registerAuthenticationStrategy(this, JwtStrategy);

    this.bind('services.JwtService').toClass(JwtService);
    this.bind('services.UserService').toClass(MyUserService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    const httpServer = http.createServer(this.requestHandler);
    const webSocketService = new WebSocketService();
    webSocketService.startServer(httpServer);
    httpServer.listen(5000, () => {
      console.log(httpServer);
      console.log('Server is running at http://127.0.0.1:5000');
    });
  }
}
