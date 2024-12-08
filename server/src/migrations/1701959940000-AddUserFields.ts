import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1701959940000 implements MigrationInterface {
    name = 'AddUserFields1701959940000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "telegramUsername" varchar,
            ADD COLUMN IF NOT EXISTS "telegramPhotoUrl" varchar,
            ADD COLUMN IF NOT EXISTS "referralCode" varchar,
            ADD COLUMN IF NOT EXISTS "referredBy" varchar,
            ADD COLUMN IF NOT EXISTS "balance" decimal(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "referralBalance" decimal(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "isVerified" boolean DEFAULT false,
            ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
        `);

        // Создаем триггер для автоматического обновления updatedAt
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updatedAt = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        await queryRunner.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
            CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON "users"
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON "users"`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
        
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN IF EXISTS "telegramUsername",
            DROP COLUMN IF EXISTS "telegramPhotoUrl",
            DROP COLUMN IF EXISTS "referralCode",
            DROP COLUMN IF EXISTS "referredBy",
            DROP COLUMN IF EXISTS "balance",
            DROP COLUMN IF EXISTS "referralBalance",
            DROP COLUMN IF EXISTS "isVerified",
            DROP COLUMN IF EXISTS "createdAt",
            DROP COLUMN IF EXISTS "updatedAt"
        `);
    }
}
