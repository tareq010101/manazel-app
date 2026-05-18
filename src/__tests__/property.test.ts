import request from 'supertest';
import app from '../app';

describe('Property Module', () => {
  let landlordToken: string;
  let tenantToken: string;

  const propertyData = {
    name: 'برج النيل',
    description: 'عمارة سكنية',
    address: {
      street: 'شارع التحرير',
      city: 'القاهرة',
      district: 'وسط البلد',
    },
  };

  beforeEach(async () => {
    const landlordRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'أحمد موجر',
        email: 'landlord@test.com',
        password: 'password123',
        phone: '01012345678',
        role: 'landlord',
      });
    landlordToken = landlordRes.body.data.tokens.accessToken;

    const tenantRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'محمد مستأجر',
        email: 'tenant@test.com',
        password: 'password123',
        phone: '01098765432',
        role: 'tenant',
      });
    tenantToken = tenantRes.body.data.tokens.accessToken;
  });

  describe('POST /api/v1/properties', () => {
    it('يجب أن يضيف عقار بنجاح — موجر', async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send(propertyData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(propertyData.name);
    });

    it('يجب أن يرفض إضافة عقار — مستأجر', async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send(propertyData);

      expect(res.status).toBe(403);
    });

    it('يجب أن يرفض بدون token', async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .send(propertyData);

      expect(res.status).toBe(401);
    });

    it('يجب أن يرفض بدون عنوان', async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({ name: 'برج النيل' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/properties', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send(propertyData);
    });

    it('يجب أن يجلب عقارات الموجر', async () => {
      const res = await request(app)
        .get('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });

    it('يجب أن يرفض المستأجر', async () => {
      const res = await request(app)
        .get('/api/v1/properties')
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/properties/:id', () => {
    let propertyId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send(propertyData);
      propertyId = res.body.data._id;
    });

    it('يجب أن يحدث العقار بنجاح', async () => {
      const res = await request(app)
        .patch(`/api/v1/properties/${propertyId}`)
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({ name: 'برج القاهرة' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('برج القاهرة');
    });

    it('يجب أن يرفض تحديث عقار موجر تاني', async () => {
      const anotherLandlordRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'موجر تاني',
          email: 'another@test.com',
          password: 'password123',
          phone: '01111111111',
          role: 'landlord',
        });
      const anotherToken = anotherLandlordRes.body.data.tokens.accessToken;

      const res = await request(app)
        .patch(`/api/v1/properties/${propertyId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ name: 'برج مسروق' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/properties/:id', () => {
    let propertyId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send(propertyData);
      propertyId = res.body.data._id;
    });

    it('يجب أن يحذف العقار بنجاح', async () => {
      const res = await request(app)
        .delete(`/api/v1/properties/${propertyId}`)
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.status).toBe(200);
    });

    it('يجب أن يرجع 404 بعد الحذف', async () => {
      await request(app)
        .delete(`/api/v1/properties/${propertyId}`)
        .set('Authorization', `Bearer ${landlordToken}`);

      const res = await request(app)
        .get(`/api/v1/properties/${propertyId}`)
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.status).toBe(404);
    });
  });
});