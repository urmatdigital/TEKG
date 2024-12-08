import { describe, it, expect, beforeEach } from 'vitest';
import { createUser } from '../../services/auth';

describe('Регистрация пользователя', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    username: 'testuser'
  };

  it('должна успешно создавать нового пользователя с валидными данными', async () => {
    const result = await createUser(testUser);
    
    expect(result).toBeDefined();
    expect(result.email).toBe(testUser.email);
    expect(result.username).toBe(testUser.username);
    expect(result.password).not.toBe(testUser.password); // пароль должен быть захэширован
  });

  it('должна выбрасывать ошибку при попытке создать пользователя с существующим email', async () => {
    await createUser(testUser);
    
    await expect(createUser(testUser)).rejects.toThrow('Пользователь с таким email уже существует');
  });

  it('должна выбрасывать ошибку при невалидном email', async () => {
    const invalidUser = { ...testUser, email: 'invalid-email' };
    
    await expect(createUser(invalidUser)).rejects.toThrow('Некорректный email');
  });

  it('должна выбрасывать ошибку при слабом пароле', async () => {
    const weakPasswordUser = { ...testUser, password: '123' };
    
    await expect(createUser(weakPasswordUser)).rejects.toThrow('Пароль должен содержать минимум 8 символов');
  });
}); 