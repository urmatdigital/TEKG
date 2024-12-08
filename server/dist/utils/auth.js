"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthCode = generateAuthCode;
exports.generateJWT = generateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAuthCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateJWT(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    }, process.env.JWT_SECRET);
}
//# sourceMappingURL=auth.js.map