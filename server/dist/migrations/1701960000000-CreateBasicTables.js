"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBasicTables1701960000000 = void 0;
class CreateBasicTables1701960000000 {
    constructor() {
        this.name = 'CreateBasicTables1701960000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID DEFAULT uuid_generate_v4() NOT NULL,
        "email" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR,
        "isAdmin" BOOLEAN NOT NULL DEFAULT false,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
        await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON "users"
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON "users"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE`);
    }
}
exports.CreateBasicTables1701960000000 = CreateBasicTables1701960000000;
//# sourceMappingURL=1701960000000-CreateBasicTables.js.map