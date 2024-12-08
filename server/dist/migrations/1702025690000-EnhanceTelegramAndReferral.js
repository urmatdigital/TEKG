"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhanceTelegramAndReferral1702025690000 = void 0;
class EnhanceTelegramAndReferral1702025690000 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN IF NOT EXISTS "telegram_id" VARCHAR(255) UNIQUE,
            ADD COLUMN IF NOT EXISTS "telegram_chat_id" VARCHAR(255) UNIQUE,
            ADD COLUMN IF NOT EXISTS "telegram_username" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "telegram_photo_url" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "telegram_first_name" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "telegram_last_name" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "phone" VARCHAR(20) UNIQUE,
            ADD COLUMN IF NOT EXISTS "client_code" VARCHAR(10) UNIQUE,
            ADD COLUMN IF NOT EXISTS "referral_code" VARCHAR(20) UNIQUE,
            ADD COLUMN IF NOT EXISTS "referred_by" UUID REFERENCES users(id),
            ADD COLUMN IF NOT EXISTS "referral_balance" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "cashback_balance" DECIMAL(10,2) DEFAULT 0
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_users_client_code ON users(client_code);
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS legacy_clients (
                id SERIAL PRIMARY KEY,
                client_code VARCHAR(10) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_legacy_clients_phone ON legacy_clients(phone);
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS referral_transactions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL REFERENCES users(id),
                referred_user_id UUID NOT NULL REFERENCES users(id),
                amount DECIMAL(10,2) NOT NULL,
                type VARCHAR(20) NOT NULL, -- 'REFERRAL_BONUS', 'ORDER_COMMISSION', 'CASHBACK'
                order_id UUID, -- nullable, for order-related transactions
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_referral_transactions_user FOREIGN KEY (user_id) REFERENCES users(id),
                CONSTRAINT fk_referral_transactions_referred_user FOREIGN KEY (referred_user_id) REFERENCES users(id)
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS referral_transactions`);
        await queryRunner.query(`DROP TABLE IF EXISTS legacy_clients`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_phone`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_users_client_code`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_legacy_clients_phone`);
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN IF EXISTS "telegram_id",
            DROP COLUMN IF EXISTS "telegram_chat_id",
            DROP COLUMN IF EXISTS "telegram_username",
            DROP COLUMN IF EXISTS "telegram_photo_url",
            DROP COLUMN IF EXISTS "telegram_first_name",
            DROP COLUMN IF EXISTS "telegram_last_name",
            DROP COLUMN IF EXISTS "phone",
            DROP COLUMN IF EXISTS "client_code",
            DROP COLUMN IF EXISTS "referral_code",
            DROP COLUMN IF EXISTS "referred_by",
            DROP COLUMN IF EXISTS "referral_balance",
            DROP COLUMN IF EXISTS "cashback_balance"
        `);
    }
}
exports.EnhanceTelegramAndReferral1702025690000 = EnhanceTelegramAndReferral1702025690000;
//# sourceMappingURL=1702025690000-EnhanceTelegramAndReferral.js.map