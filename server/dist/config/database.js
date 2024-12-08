"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const _1701960000000_CreateBasicTables_1 = require("../migrations/1701960000000-CreateBasicTables");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ["dist/**/*.entity.js"],
    migrations: [_1701960000000_CreateBasicTables_1.CreateBasicTables1701960000000],
    synchronize: false,
};
exports.AppDataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
console.log('Database configuration:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    env: process.env.NODE_ENV
});
//# sourceMappingURL=database.js.map