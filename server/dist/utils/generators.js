"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClientCode = void 0;
const generateClientCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const getRandomChars = (chars, count) => {
        return Array.from({ length: count }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    };
    return getRandomChars(letters, 2) + getRandomChars(numbers, 4);
};
exports.generateClientCode = generateClientCode;
//# sourceMappingURL=generators.js.map