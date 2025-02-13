import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mysqlDb',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'triveni@123',
  database: 'countrymaster',
  multipleStatements: true,
};

// Observe application's life cycle
@lifeCycleObserver('datasource')
export class MysqlDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mysqlDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysqlDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
    try {
      if (this.connector) {
        console.log('✅ MySQL connection established successfully!');
      }
    } catch (error) {
      console.error('❌ MySQL connection failed:', error);
    }
  }
}
