"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
console.log('Starting migrations...');
database_1.AppDataSource.initialize()
    .then(async () => {
    console.log("Running migrations...");
    try {
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        const tableExists = await queryRunner.hasTable("typeorm_migrations");
        if (!tableExists) {
            console.log("Creating migrations table...");
            await queryRunner.query(`
          CREATE TABLE "typeorm_migrations" (
            "id" SERIAL PRIMARY KEY,
            "timestamp" BIGINT NOT NULL,
            "name" character varying NOT NULL
          )
        `);
        }
        await queryRunner.release();
        await database_1.AppDataSource.runMigrations();
        console.log("Migrations completed successfully!");
    }
    catch (error) {
        console.error("Error running migrations:", error);
    }
    await database_1.AppDataSource.destroy();
    process.exit(0);
})
    .catch((error) => {
    console.error("Error during initialization:", error);
    process.exit(1);
});
//# sourceMappingURL=run-migrations.js.map