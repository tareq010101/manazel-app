import swaggerJsdoc from 'swagger-jsdoc';
import { envConfig } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Manazel API',
      version: '1.0.0',
      description: 'API لتطبيق إدارة العقارات — منازل',
    },
    servers: [
      {
        url: `http://localhost:${envConfig.PORT}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Auth
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone', 'role'],
          properties: {
            name: { type: 'string', example: 'أحمد محمد' },
            email: { type: 'string', example: 'ahmed@test.com' },
            password: { type: 'string', example: 'password123' },
            phone: { type: 'string', example: '01012345678' },
            role: { type: 'string', enum: ['landlord', 'tenant'] },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'ahmed@test.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        // Property
        CreatePropertyRequest: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            name: { type: 'string', example: 'برج النيل' },
            description: { type: 'string', example: 'عمارة سكنية' },
            address: {
              type: 'object',
              required: ['street', 'city', 'district'],
              properties: {
                street: { type: 'string', example: 'شارع التحرير' },
                city: { type: 'string', example: 'القاهرة' },
                district: { type: 'string', example: 'وسط البلد' },
              },
            },
          },
        },
        // Unit
        CreateUnitRequest: {
          type: 'object',
          required: ['unitNumber', 'floor', 'rooms', 'bathrooms', 'area', 'price'],
          properties: {
            unitNumber: { type: 'string', example: '3B' },
            floor: { type: 'number', example: 3 },
            rooms: { type: 'number', example: 3 },
            bathrooms: { type: 'number', example: 2 },
            area: { type: 'number', example: 150 },
            price: { type: 'number', example: 3500 },
            description: { type: 'string', example: 'شقة مميزة' },
          },
        },
        // Contract
        CreateContractRequest: {
          type: 'object',
          required: ['unitId', 'tenantId', 'startDate', 'endDate', 'monthlyRent', 'securityDeposit'],
          properties: {
            unitId: { type: 'string', example: '64abc123...' },
            tenantId: { type: 'string', example: '64abc456...' },
            startDate: { type: 'string', format: 'date', example: '2026-06-01' },
            endDate: { type: 'string', format: 'date', example: '2027-06-01' },
            monthlyRent: { type: 'number', example: 3500 },
            securityDeposit: { type: 'number', example: 7000 },
          },
        },
        // Payment
        CreatePaymentRequest: {
          type: 'object',
          required: ['contractId', 'type', 'amount', 'dueDate'],
          properties: {
            contractId: { type: 'string', example: '64abc123...' },
            type: {
              type: 'string',
              enum: ['rent', 'water', 'electricity', 'maintenance', 'other'],
            },
            amount: { type: 'number', example: 3500 },
            dueDate: { type: 'string', format: 'date', example: '2026-06-01' },
            note: { type: 'string', example: 'إيجار شهر يونيو' },
          },
        },
        // Maintenance
        CreateMaintenanceRequest: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: 'عطل في التكييف' },
            description: { type: 'string', example: 'التكييف مش شغال من 3 أيام' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        },
        // Responses
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'تمت العملية بنجاح' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'حدث خطأ' },
            data: { type: 'null' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // AUTH
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'تسجيل حساب جديد',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم التسجيل بنجاح' },
            400: { description: 'بيانات غير صحيحة' },
            409: { description: 'الإيميل مسجل بالفعل' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'تسجيل الدخول',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: { description: 'تم تسجيل الدخول بنجاح' },
            401: { description: 'الإيميل أو الباسورد غلط' },
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'تجديد الـ token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
              },
            },
          },
          responses: {
            200: { description: 'تم تجديد الـ token بنجاح' },
            401: { description: 'الـ refresh token غير صالح' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'تسجيل الخروج',
          responses: {
            200: { description: 'تم تسجيل الخروج بنجاح' },
            401: { description: 'غير مصرح' },
          },
        },
      },
      // USERS
      '/users/me': {
        get: {
          tags: ['Users'],
          summary: 'جلب بياناتي',
          responses: {
            200: { description: 'تم جلب البيانات بنجاح' },
            401: { description: 'غير مصرح' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'تحديث بياناتي',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'تم التحديث بنجاح' },
            401: { description: 'غير مصرح' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'إلغاء حسابي',
          responses: {
            200: { description: 'تم إلغاء الحساب' },
            401: { description: 'غير مصرح' },
          },
        },
      },
      // PROPERTIES
      '/properties': {
        post: {
          tags: ['Properties'],
          summary: 'إضافة عقار جديد — موجر فقط',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatePropertyRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم إضافة العقار بنجاح' },
            403: { description: 'ممنوع الوصول' },
          },
        },
        get: {
          tags: ['Properties'],
          summary: 'جلب كل عقاراتي — موجر فقط',
          responses: {
            200: { description: 'تم جلب العقارات بنجاح' },
          },
        },
      },
      '/properties/{id}': {
        get: {
          tags: ['Properties'],
          summary: 'جلب عقار معين',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم جلب العقار بنجاح' },
            404: { description: 'العقار مش موجود' },
          },
        },
        patch: {
          tags: ['Properties'],
          summary: 'تحديث عقار',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatePropertyRequest' },
              },
            },
          },
          responses: {
            200: { description: 'تم التحديث بنجاح' },
            404: { description: 'العقار مش موجود' },
          },
        },
        delete: {
          tags: ['Properties'],
          summary: 'حذف عقار',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم الحذف بنجاح' },
            404: { description: 'العقار مش موجود' },
          },
        },
      },
      // UNITS
      '/properties/{propertyId}/units': {
        post: {
          tags: ['Units'],
          summary: 'إضافة وحدة — موجر فقط',
          parameters: [
            { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUnitRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم إضافة الوحدة بنجاح' },
          },
        },
        get: {
          tags: ['Units'],
          summary: 'جلب وحدات عقار — موجر فقط',
          parameters: [
            { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم جلب الوحدات بنجاح' },
          },
        },
      },
      '/properties/units/available': {
        get: {
          tags: ['Units'],
          summary: 'الوحدات المتاحة للإيجار',
          responses: {
            200: { description: 'تم جلب الوحدات المتاحة بنجاح' },
          },
        },
      },
      // CONTRACTS
      '/contracts': {
        post: {
          tags: ['Contracts'],
          summary: 'إنشاء عقد إيجار — موجر فقط',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateContractRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم إنشاء العقد بنجاح' },
            409: { description: 'الوحدة مش متاحة' },
          },
        },
        get: {
          tags: ['Contracts'],
          summary: 'جلب كل العقود — موجر فقط',
          responses: {
            200: { description: 'تم جلب العقود بنجاح' },
          },
        },
      },
      '/contracts/my': {
        get: {
          tags: ['Contracts'],
          summary: 'جلب عقدي — مستأجر فقط',
          responses: {
            200: { description: 'تم جلب العقد بنجاح' },
            404: { description: 'مفيش عقد فعال' },
          },
        },
      },
      '/contracts/{id}': {
        get: {
          tags: ['Contracts'],
          summary: 'جلب عقد معين',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم جلب العقد بنجاح' },
            404: { description: 'العقد مش موجود' },
          },
        },
      },
      '/contracts/{id}/terminate': {
        patch: {
          tags: ['Contracts'],
          summary: 'إنهاء عقد — موجر فقط',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['reason'],
                  properties: {
                    reason: { type: 'string', example: 'انتهاء مدة العقد' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'تم إنهاء العقد بنجاح' },
            404: { description: 'العقد مش موجود' },
          },
        },
      },
      // PAYMENTS
      '/payments': {
        post: {
          tags: ['Payments'],
          summary: 'إنشاء دفعة — موجر فقط',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatePaymentRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم إنشاء الدفعة بنجاح' },
          },
        },
        get: {
          tags: ['Payments'],
          summary: 'جلب كل الدفعات — موجر فقط',
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['pending', 'paid', 'overdue'] },
            },
          ],
          responses: {
            200: { description: 'تم جلب الدفعات بنجاح' },
          },
        },
      },
      '/payments/summary': {
        get: {
          tags: ['Payments'],
          summary: 'ملخص الدفعات — موجر فقط',
          responses: {
            200: { description: 'تم جلب الملخص بنجاح' },
          },
        },
      },
      '/payments/my': {
        get: {
          tags: ['Payments'],
          summary: 'جلب دفعاتي — مستأجر فقط',
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['pending', 'paid', 'overdue'] },
            },
          ],
          responses: {
            200: { description: 'تم جلب دفعاتك بنجاح' },
          },
        },
      },
      '/payments/{id}/pay': {
        patch: {
          tags: ['Payments'],
          summary: 'تأكيد الدفع — موجر فقط',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم تأكيد الدفع بنجاح' },
            404: { description: 'الدفعة مش موجودة' },
          },
        },
      },
      // MAINTENANCE
      '/maintenance': {
        post: {
          tags: ['Maintenance'],
          summary: 'إرسال طلب صيانة — مستأجر فقط',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateMaintenanceRequest' },
              },
            },
          },
          responses: {
            201: { description: 'تم إرسال الطلب بنجاح' },
          },
        },
        get: {
          tags: ['Maintenance'],
          summary: 'جلب طلبات الصيانة — موجر فقط',
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['pending', 'in_progress', 'completed', 'rejected'],
              },
            },
          ],
          responses: {
            200: { description: 'تم جلب الطلبات بنجاح' },
          },
        },
      },
      '/maintenance/my': {
        get: {
          tags: ['Maintenance'],
          summary: 'جلب طلباتي — مستأجر فقط',
          responses: {
            200: { description: 'تم جلب طلباتك بنجاح' },
          },
        },
      },
      '/maintenance/{id}/status': {
        patch: {
          tags: ['Maintenance'],
          summary: 'تحديث حالة الطلب — موجر فقط',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['in_progress', 'completed', 'rejected'],
                    },
                    rejectionReason: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'تم تحديث الحالة بنجاح' },
          },
        },
      },
      // CHAT
      '/chats/my': {
        get: {
          tags: ['Chat'],
          summary: 'جلب أو إنشاء المحادثة',
          responses: {
            200: { description: 'تم جلب المحادثة بنجاح' },
          },
        },
      },
      '/chats/unread': {
        get: {
          tags: ['Chat'],
          summary: 'عدد الرسائل غير المقروءة',
          responses: {
            200: { description: 'تم جلب العدد بنجاح' },
          },
        },
      },
      '/chats/{id}/messages': {
        get: {
          tags: ['Chat'],
          summary: 'جلب رسائل المحادثة',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'تم جلب الرسائل بنجاح' },
          },
        },
      },
      // NOTIFICATIONS
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'جلب الإشعارات',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: { description: 'تم جلب الإشعارات بنجاح' },
          },
        },
      },
      '/notifications/read-all': {
        patch: {
          tags: ['Notifications'],
          summary: 'تحديد كل الإشعارات كمقروءة',
          responses: {
            200: { description: 'تم التحديث بنجاح' },
          },
        },
      },
      '/notifications/all': {
        delete: {
          tags: ['Notifications'],
          summary: 'حذف كل الإشعارات',
          responses: {
            200: { description: 'تم الحذف بنجاح' },
          },
        },
      },
      '/notifications/{id}/read': {
        patch: {
          tags: ['Notifications'],
          summary: 'تحديد إشعار كمقروء',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم التحديث بنجاح' },
          },
        },
      },
      '/notifications/{id}': {
        delete: {
          tags: ['Notifications'],
          summary: 'حذف إشعار',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'تم الحذف بنجاح' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);