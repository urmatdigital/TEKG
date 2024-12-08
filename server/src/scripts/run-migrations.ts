import { AppDataSource } from "../config/database"

console.log('Starting migrations...')

AppDataSource.initialize()
  .then(async () => {
    console.log("Running migrations...")
    
    try {
      // Проверяем существование таблицы миграций
      const queryRunner = AppDataSource.createQueryRunner();
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

      // Запускаем миграции
      await AppDataSource.runMigrations()
      console.log("Migrations completed successfully!")
    } catch (error) {
      console.error("Error running migrations:", error)
    }
    
    await AppDataSource.destroy()
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error during initialization:", error)
    process.exit(1)
  }) 