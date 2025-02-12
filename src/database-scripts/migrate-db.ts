import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseMigration {
  constructor(
    @inject('datasources.mysql') private dataSource: juggler.DataSource,
  ) {}

  async run(): Promise<void> {
    const scriptsDir = path.join(__dirname, '../database-scripts');
    const files = fs.readdirSync(scriptsDir).sort(); // Ensure execution order

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(scriptsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`🔄 Running Migration: ${file}`);
        try {
          await this.dataSource.execute(sql);
          console.log(`✅ Successfully Applied: ${file}`);
        } catch (error) {
          console.error(`❌ Error Applying ${file}:`, error);
        }
      }
    }
  }
}
