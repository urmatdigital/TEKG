import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

// DTO для регистрации
export class RegisterDto {
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password: string;

    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Имя не может быть пустым' })
    firstName: string;

    @IsString({ message: 'Телефон должен быть строкой' })
    @IsNotEmpty({ message: 'Телефон не может быть пустым' })
    phone: string;
}

// DTO для верификации
export class VerifyDto {
    @IsString({ message: 'ID пользователя должен быть строкой' })
    @IsNotEmpty({ message: 'ID пользователя не может быть пустым' })
    userId: string;

    @IsString({ message: 'Код подтверждения должен быть строкой' })
    @IsNotEmpty({ message: 'Код подтверждения не может быть пустым' })
    @MinLength(6, { message: 'Код подтверждения должен содержать 6 символов' })
    code: string;
}

// DTO для логина
export class LoginDto {
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    password: string;
}
