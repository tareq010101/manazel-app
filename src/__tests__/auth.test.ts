import request from 'supertest';
import app from '../app';

describe('Auth Module', () => {
  const landlordData = {
    name: 'أحمد محمد',
    email: 'ahmed@test.com',
    password: 'password123',
    phone: '01012345678',
    role: 'landlord',
  };

  const tenantData = {
    name: 'محمد علي',
    email: 'mohamed@test.com',
    password: 'password123',
    phone: '01098765432',
    role: 'tenant',
  };

  describe('POST /api/v1/auth/register', () => {
    it('يجب أن يسجل مستخدم جديد بنجاح', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(landlordData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('يجب أن يرفض التسجيل بإيميل موجود بالفعل', async () => {
      await request(app).post('/api/v1/auth/register').send(landlordData);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(landlordData);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('يجب أن يرفض التسجيل ببيانات ناقصة', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@test.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('يجب أن يرفض الإيميل الغلط', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...landlordData, email: 'not-an-email' });

      expect(res.status).toBe(400);
    });

    it('يجب أن يرفض الباسورد القصير', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...landlordData, password: '123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(landlordData);
    });

    it('يجب أن يسجل الدخول بنجاح', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: landlordData.email, password: landlordData.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('يجب أن يرفض الباسورد الغلط', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: landlordData.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('يجب أن يرفض الإيميل الغير موجود', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'notfound@test.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('يجب أن يسجل الخروج بنجاح', async () => {
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send(landlordData);

      const token = registerRes.body.data.tokens.accessToken;

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('يجب أن يرفض الخروج بدون token', async () => {
      const res = await request(app).post('/api/v1/auth/logout');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('يجب أن يجدد الـ token بنجاح', async () => {
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send(landlordData);

      const refreshToken = registerRes.body.data.tokens.refreshToken;

      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('يجب أن يرفض الـ refresh token الغلط', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(res.status).toBe(401);
    });
  });
});