"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDisplayName = getUserDisplayName;
exports.sanitizeUser = sanitizeUser;
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
function getUserDisplayName(user) {
    return user.firstName + (user.lastName ? ` ${user.lastName}` : '');
}
function sanitizeUser(user) {
    const { password } = user, sanitizedUser = __rest(user, ["password"]);
    return sanitizedUser;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPassword(password) {
    return password.length >= 6;
}
//# sourceMappingURL=user.utils.js.map