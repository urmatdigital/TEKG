"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const legacy_client_entity_1 = require("../auth/entities/legacy-client.entity");
const referral_transaction_entity_1 = require("../auth/entities/referral-transaction.entity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.User, legacy_client_entity_1.LegacyClient, referral_transaction_entity_1.ReferralTransaction],
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
    synchronize: false,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
    logging: process.env.NODE_ENV === 'development',
    autoLoadEntities: true
};
exports.AppDataSource = new typeorm_1.DataSource(Object.assign(Object.assign({}, exports.typeOrmConfig), { type: 'postgres' }));
//# sourceMappingURL=typeorm.config.js.map