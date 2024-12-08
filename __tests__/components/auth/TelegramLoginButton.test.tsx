import { render, screen } from '@testing-library/react';
import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';

describe('TelegramLoginButton', () => {
  const mockOnAuth = jest.fn();

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('renders telegram login widget', () => {
    render(
      <TelegramLoginButton
        botName="TestBot"
        onAuth={mockOnAuth}
        buttonSize="large"
        lang="ru"
      />
    );

    const widget = screen.getByTestId('telegram-login');
    expect(widget).toHaveAttribute('data-telegram-login', 'TestBot');
    expect(widget).toHaveAttribute('data-size', 'large');
    expect(widget).toHaveAttribute('data-lang', 'ru');
  });

  it('calls onAuth when telegram auth succeeds', () => {
    render(
      <TelegramLoginButton
        botName="TestBot"
        onAuth={mockOnAuth}
        buttonSize="large"
        lang="ru"
      />
    );

    // Эмулируем ответ от Telegram
    const mockUser = {
      id: 123456789,
      first_name: 'Test',
      username: 'testuser',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'test-hash'
    };

    // Вызываем глобальный обработчик
    window.onTelegramAuth(mockUser);

    expect(mockOnAuth).toHaveBeenCalledWith(mockUser);
  });
}); 