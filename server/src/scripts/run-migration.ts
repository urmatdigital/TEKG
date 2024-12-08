import { AppDataSource } from '../config/typeorm.config';
import { AddUserFields1701959940000 } from '../migrations/1701959940000-AddUserFields';

async function runMigration() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    const migration = new AddUserFields1701959940000();
    await migration.up(AppDataSource.createQueryRunner());
    console.log('Migration completed successfully');

    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
