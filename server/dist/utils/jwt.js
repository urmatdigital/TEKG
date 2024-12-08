"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const generateToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, config_1.config.jwt.secret, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.config.jwt.secret);
        return {
            id: decoded.id,
            email: decoded.email,
            isVerified: decoded.isVerified,
            isAdmin: decoded.isAdmin
        };
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const extractTokenFromHeader = (header) => {
    const [type, token] = header.split(' ');
    return type === 'Bearer' && token ? token : null;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.js.map