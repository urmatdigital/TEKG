import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/auth/verify';

describe('/api/auth/verify', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
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

  it('validates required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {}
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Missing required fields'
    });
  });

  it('successfully verifies valid code', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        telegram_id: 123456789,
        auth_code: '123456'
      }
    });

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'jwt-token' })
      })
    );

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      token: 'jwt-token'
    });
  });
}); 