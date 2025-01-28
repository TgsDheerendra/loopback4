import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import debugFactory from 'debug';
import path from 'path';
import {MysqlDbDataSource} from './datasources/mysql-db.datasource';
import {MySequence} from './sequence';
import {JwtService} from './services/jwt.service';
import {MyUserService} from './services/user.service'; // Import the service
import {JwtStrategy} from './strategies/jwt-strategy';

const debug = debugFactory('loopback:example:socketio:demo');

export {ApplicationConfig};

export class CountrymasterpocApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
  // SocketIoApplication,
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

    // JWT Authentication Setup
    this.component(AuthenticationComponent);
    //this.component(JWTAuthenticationComponent);
    this.dataSource(MysqlDbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // Register the custom JWT strategy
    registerAuthenticationStrategy(this, JwtStrategy);

    // Bind custom services
    this.bind('services.JwtService').toClass(JwtService);
    this.bind('services.UserService').toClass(MyUserService);

    this.projectRoot = __dirname;

    // this.socketServer.use((socket, next) => {
    //   debug('Global middleware - socket:', socket.id);
    //   next();
    // });

    // const ns = this.socketServer.route(SocketIoController);
    // ns.use((socket, next) => {
    //   debug(
    //     'Middleware for namespace %s - socket: %s',
    //     socket.nsp.name,
    //     socket.id,
    //   );
    //   next();
    // });

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    // Register the Socket.IO component for real-time communication
    //this.component(SocketIoComponent);
  }
}
