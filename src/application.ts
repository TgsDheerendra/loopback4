import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {CrudRestComponent} from '@loopback/rest-crud';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DatabaseMigration} from './database-scripts/migrate-db'; // Ensure this is imported
import {MysqlDbDataSource} from './datasources/mysql-db.datasource';
import {MySequence} from './sequence';
import {JwtStrategy} from './services/jwt-strategy';
import {JwtService} from './services/jwt.service';
import {MyUserService} from './services/user.service';

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
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(CrudRestComponent);
  }

  // ✅ Move Migration logic to a separate lifecycle method
  async boot() {
    await super.boot();

    try {
      console.log('Running database migrations...');
      const mysqlDs = new MysqlDbDataSource();
      const migration = new DatabaseMigration(mysqlDs);
      await migration.run();
      console.log('Database migrations completed successfully.');
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}
