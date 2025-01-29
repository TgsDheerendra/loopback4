import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {MysqlDbDataSource} from '../../datasources';
import {MigrationService} from '../../services/migration.services';

@lifeCycleObserver('')
export class MigrationObserver implements LifeCycleObserver {
  constructor(
    @inject('datasources.mysqlDb') private dataSource: MysqlDbDataSource,
  ) {}

  /**
   * This method is called when the application starts.
   */
  async start(): Promise<void> {
    const migrationService = new MigrationService(this.dataSource);
    try {
      await migrationService.runMigrations();
      console.log('Database migrations completed successfully.');
    } catch (err) {
      console.error('Error running database migrations:', err);
      throw err;
    }
  }

  /**
   * This method is called when the application stops.
   */
  stop(): void {
    // No specific stop behavior needed for migrations.
  }
}
