import request from 'supertest';
import app from '../app';

describe('Payment Module', () => {
  let landlordToken: string;
  let tenantToken: string;
  let contractId: string;

  beforeEach(async () => {
    // تسجيل موجر
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
    const landlordId = landlordRes.body.data.user._id;

    // تسجيل مستأجر
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
    const tenantId = tenantRes.body.data.user._id;

    // إضافة عقار
    const propertyRes = await request(app)
      .post('/api/v1/properties')
      .set('Authorization', `Bearer ${landlordToken}`)
      .send({
        name: 'برج النيل',
        address: { street: 'شارع التحرير', city: 'القاهرة', district: 'وسط البلد' },
      });
    const propertyId = propertyRes.body.data._id;

    // إضافة وحدة
    const unitRes = await request(app)
      .post(`/api/v1/properties/${propertyId}/units`)
      .set('Authorization', `Bearer ${landlordToken}`)
      .send({
        unitNumber: '3B',
        floor: 3,
        rooms: 3,
        bathrooms: 2,
        area: 150,
        price: 3500,
      });
    const unitId = unitRes.body.data._id;

    // إنشاء عقد
    const contractRes = await request(app)
      .post('/api/v1/contracts')
      .set('Authorization', `Bearer ${landlordToken}`)
      .send({
        unitId,
        tenantId,
        startDate: '2026-06-01',
        endDate: '2027-06-01',
        monthlyRent: 3500,
        securityDeposit: 7000,
      });
    contractId = contractRes.body.data._id;
  });

  describe('POST /api/v1/payments', () => {
    it('يجب أن ينشئ دفعة بنجاح', async () => {
      const res = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          contractId,
          type: 'rent',
          amount: 3500,
          dueDate: '2026-06-01',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(3500);
      expect(res.body.data.status).toBe('pending');
    });

    it('يجب أن يرفض المستأجر من إنشاء دفعة', async () => {
      const res = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          contractId,
          type: 'rent',
          amount: 3500,
          dueDate: '2026-06-01',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/payments/:id/pay', () => {
    it('يجب أن يؤكد الدفع بنجاح', async () => {
      const createRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          contractId,
          type: 'rent',
          amount: 3500,
          dueDate: '2026-06-01',
        });

      const paymentId = createRes.body.data._id;

      const res = await request(app)
        .patch(`/api/v1/payments/${paymentId}/pay`)
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('paid');
      expect(res.body.data.paidAt).toBeDefined();
    });
  });

  describe('GET /api/v1/payments/summary', () => {
    it('يجب أن يرجع ملخص الدفعات', async () => {
      await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          contractId,
          type: 'rent',
          amount: 3500,
          dueDate: '2026-06-01',
        });

      const res = await request(app)
        .get('/api/v1/payments/summary')
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(1);
      expect(res.body.data.pending).toBe(1);
      expect(res.body.data.totalAmount).toBe(3500);
    });
  });
});