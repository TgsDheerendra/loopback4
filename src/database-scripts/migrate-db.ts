import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as fs from 'fs';
import * as path from 'path';

export class DatabaseMigration {
  constructor(
    @inject('datasources.mysql') private dataSource: juggler.DataSource,
  ) {}

  async run(): Promise<void> {
    // Ensure `dbversion` table exists
    await this.createMigrationHistoryTable();

    const scriptsDir = path.resolve(__dirname, '../../src/database-scripts');
    if (!fs.existsSync(scriptsDir)) {
      console.error(`Migration folder not found: ${scriptsDir}`);
      return;
    }

    const files = fs
      .readdirSync(scriptsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure execution order

    if (files.length === 0) {
      console.log(`No migration scripts found in ${scriptsDir}`);
      return;
    }

    console.log(`🔍 Found ${files.length} migration scripts. Checking...`);

    try {
      for (const file of files) {
        if (await this.isMigrationApplied(file)) {
          console.log(`✅ Skipping already applied migration: ${file}`);
          continue;
        }

        const filePath = path.join(scriptsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`🚀 Running Migration: ${file}`);
        await this.dataSource.execute(sql, []);
        await this.markMigrationAsApplied(file);
        console.log(`✅ Successfully Applied: ${file}`);
      }

      console.log('🎉 All pending migrations applied successfully!');
    } catch (error) {
      console.error(`❌ Error Applying Migration:`, error);
    }
  }

  // Creates dbversion table if it doesn't exist
  private async createMigrationHistoryTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS dbversion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await this.dataSource.execute(sql);
  }

  // Checks if a migration has already been applied
  private async isMigrationApplied(filename: string): Promise<boolean> {
    const result = await this.dataSource.execute(
      'SELECT COUNT(*) as count FROM dbversion WHERE filename = ?',
      [filename],
    );
    return result[0].count > 0;
  }

  // Marks a migration as applied
  private async markMigrationAsApplied(filename: string) {
    await this.dataSource.execute(
      'INSERT INTO dbversion (filename) VALUES (?)',
      [filename],
    );
  }
}
