"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPasswordHash1701975600000 = void 0;
class AddPasswordHash1701975600000 {
    constructor() {
        this.name = 'AddPasswordHash1701975600000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    }
}
exports.AddPasswordHash1701975600000 = AddPasswordHash1701975600000;
//# sourceMappingURL=1701975600000-AddPasswordHash.js.map