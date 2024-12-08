"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const _1701960000000_CreateBasicTables_1 = require("./migrations/1701960000000-CreateBasicTables");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity.js'],
    migrations: [_1701960000000_CreateBasicTables_1.CreateBasicTables1701960000000],
    synchronize: false,
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map