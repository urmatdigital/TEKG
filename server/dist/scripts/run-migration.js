"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_config_1 = require("../config/typeorm.config");
const _1701959940000_AddUserFields_1 = require("../migrations/1701959940000-AddUserFields");
async function runMigration() {
    try {
        await typeorm_config_1.AppDataSource.initialize();
        console.log('Database connection initialized');
        const migration = new _1701959940000_AddUserFields_1.AddUserFields1701959940000();
        await migration.up(typeorm_config_1.AppDataSource.createQueryRunner());
        console.log('Migration completed successfully');
        await typeorm_config_1.AppDataSource.destroy();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error running migration:', error);
        process.exit(1);
    }
}
runMigration();
//# sourceMappingURL=run-migration.js.map