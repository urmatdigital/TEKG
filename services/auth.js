import bcrypt from 'bcrypt';

export async function createUser({ email, password, username }) {
  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Некорректный email');
  }

  // Валидация пароля
  if (password.length < 8) {
    throw new Error('Пароль должен содержать минимум 8 символов');
  }

  // Проверка существующего пользователя
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Пользователь с таким email уже существует');
  }

  // Хэширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создание пользователя в базе данных
  const user = {
    email,
    password: hashedPassword,
    username,
    createdAt: new Date()
  };

  // Здесь должно быть сохранение в базу данных
  // Для примера просто возвращаем объект
  return user;
}

// Вспомогательная функция для поиска пользователя
async function findUserByEmail(email) {
  // Здесь должен быть запрос к базе данных
  // Для примера возвращаем null
  return null;
} 