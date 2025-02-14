import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {DatabaseMigration} from '../database-scripts/migrate-db';
import {MysqlDbDataSource} from '../datasources';

export class MigrationController {
  constructor(
    @inject('datasources.mysql') private dataSource: MysqlDbDataSource,
  ) {}

  @get('/run-migrations', {
    responses: {
      '200': {
        description: 'Run database migrations',
      },
    },
  })
  async runMigrations(): Promise<object> {
    const migration = new DatabaseMigration(this.dataSource);

    try {
      console.log('Triggering database migration...');
      await migration.run();
      return {status: 'success', message: 'Migrations applied successfully'};
    } catch (error) {
      console.error('Migration failed:', error);
      return {status: 'error', message: 'Migration failed', error};
    }
  }
}
