import {inject} from '@loopback/core';
import fs from 'fs';
import path from 'path';
import {MysqlDbDataSource} from '../datasources';

export class MigrationService {
  constructor(
    @inject('datasources.mysqlDb') private dataSource: MysqlDbDataSource,
  ) {}

  async runMigrations() {
    // Resolve the migrations folder relative to the project root
    const migrationFolder = path.resolve(process.cwd(), 'src/db/migrations');

    // Check if the migrations folder exists
    if (!fs.existsSync(migrationFolder)) {
      console.warn(`Migration folder not found: ${migrationFolder}`);
      return; // Exit gracefully if folder does not exist
    }
    const files = fs.readdirSync(migrationFolder).sort(); // Sort files to ensure order
    if (files.length === 0) {
      console.log('No migration files found to execute.');
      return; // Exit gracefully if no files are found
    }
    for (const file of files) {
      const migrationName = file;
      // let migrationSql = `SELECT COUNT(*) AS count FROM migrations WHERE migration_name = '${migrationName}'`;

      // const [result] = await this.dataSource.execute(migrationSql);

      // if (result[0]?.count > 0) {
      //   console.log(`Migration already executed: ${migrationName}`);
      //   continue;
      // }

      // Read the SQL file and execute its contents
      const sql = fs.readFileSync(path.join(migrationFolder, file), 'utf8');
      console.log(`Executing migration: ${migrationName} ${sql}`);
      await this.dataSource.execute(sql);

      // // Record the migration as executed
      // migrationSql = `INSERT INTO migrations (migration_name) VALUES ('${migrationName.replace("'", "''")}')`;
      // await this.dataSource.execute(migrationSql);
      // console.log('Migration recorded successfully');
    }

    console.log('All migrations executed successfully.');
  }
}
