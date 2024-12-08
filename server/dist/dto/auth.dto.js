"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.VerifyDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Пароль должен быть строкой' }),
    (0, class_validator_1.MinLength)(6, { message: 'Пароль должен содержать минимум 6 символов' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Имя должно быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Имя не может быть пустым' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Телефон должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Телефон не может быть пустым' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
class VerifyDto {
}
exports.VerifyDto = VerifyDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'ID пользователя должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID пользователя не может быть пустым' }),
    __metadata("design:type", String)
], VerifyDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Код подтверждения должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Код подтверждения не может быть пустым' }),
    (0, class_validator_1.MinLength)(6, { message: 'Код подтверждения должен содержать 6 символов' }),
    __metadata("design:type", String)
], VerifyDto.prototype, "code", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Пароль должен быть строкой' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Пароль не может быть пустым' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map