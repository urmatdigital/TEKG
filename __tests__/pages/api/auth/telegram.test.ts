import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/auth/telegram';
import { createHash, createHmac } from 'crypto';

describe('/api/auth/telegram', () => {
  const mockTelegramData = {
    id: 123456789,
    first_name: 'Test',
    username: 'testuser',
    auth_date: Math.floor(Date.now() / 1000),
    hash: ''
  };

  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';

    // Генерируем правильный hash
    const secretKey = createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();

    const dataCheckString = Object.entries(mockTelegramData)
      .filter(([key]) => key !== 'hash')
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    mockTelegramData.hash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed'
    });
  });

  it('validates telegram auth data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...mockTelegramData,
        hash: 'invalid-hash'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid authentication data'
    });
  });

  it('successfully processes valid telegram auth', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: mockTelegramData
    });

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ auth_code: '123456' })
      })
    );

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      auth_code: '123456'
    });
  });
}); 