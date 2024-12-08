import '@testing-library/jest-dom';

// Мок для fetch
global.fetch = jest.fn();

// Мок для window.onTelegramAuth
global.window.onTelegramAuth = jest.fn(); 