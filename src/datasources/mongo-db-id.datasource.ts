import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongoDbId',
  connector: 'mongodb',
  url: '',
  host: 'localhost',
  port: 27017,
  user: 'fjt',
  password: 'triveni123',
  database: 'admin',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  },
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDbIdDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongoDbId';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongoDbId', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
    try {
      if (this.connector) {
        console.log('Mongo connection established successfully!');
      }
    } catch (error) {
      console.error('Mongo connection failed:', error);
    }
  }
}
