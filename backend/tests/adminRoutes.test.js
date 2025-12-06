import request from 'supertest';
import app from '../src/app.js';
import { Customer, Admin, Table, TableType, Promo } from '../src/models/index.js';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../src/config/auth.js';

describe('Admin-Only Route Protection', () => {
  let customerToken;
  let adminToken;
  let staffToken;
  let testTableType;

  beforeAll(async () => {
    // Create test table type for tests
    testTableType = await TableType.create({
      name: 'Test Type',
      hourly_rate: 75000,
      description: 'Test table type'
    });

    // Create test customer
    const testCustomer = await Customer.create({
      name: 'Test Customer',
      email: 'customer@admin-test.com',
      password: 'password123',
      phone: '08123456789'
    });

    // Create test admin
    const testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'admin@admin-test.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create test staff (lower role)
    const testStaff = await Admin.create({
      name: 'Test Staff',
      email: 'staff@admin-test.com',
      password: 'staff123',
      role: 'staff'
    });

    // Generate tokens
    customerToken = jwt.sign(
      { id: testCustomer.id, email: testCustomer.email, type: 'customer' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    adminToken = jwt.sign(
      { id: testAdmin.id, email: testAdmin.email, type: 'admin', role: 'admin' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    staffToken = jwt.sign(
      { id: testStaff.id, email: testStaff.email, type: 'admin', role: 'staff' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  });

  afterAll(async () => {
    // Clean up created data
    await Customer.destroy({ where: { email: 'customer@admin-test.com' } });
    await Admin.destroy({ where: { email: { $in: ['admin@admin-test.com', 'staff@admin-test.com'] } } });
    await TableType.destroy({ where: { name: 'Test Type' } });
  });

  describe('POST /api/admin/tables', () => {
    it('should allow admin to create table', async () => {
      const tableData = {
        table_number: 'A01',
        table_type_id: testTableType.id,
        status: 'available'
      };

      const response = await request(app)
        .post('/api/admin/tables')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(tableData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.table_number).toBe(tableData.table_number);

      // Clean up
      await Table.destroy({ where: { table_number: 'A01' } });
    });

    it('should reject customer from creating table', async () => {
      const tableData = {
        table_number: 'A02',
        table_type_id: testTableType.id,
        status: 'available'
      };

      const response = await request(app)
        .post('/api/admin/tables')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(tableData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('require admin role');
    });

    it('should reject unauthenticated access', async () => {
      const tableData = {
        table_number: 'A03',
        table_type_id: testTableType.id,
        status: 'available'
      };

      const response = await request(app)
        .post('/api/admin/tables')
        .send(tableData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should allow staff to create table', async () => {
      const tableData = {
        table_number: 'A04',
        table_type_id: testTableType.id,
        status: 'available'
      };

      const response = await request(app)
        .post('/api/admin/tables')
        .set('Authorization', `Bearer ${staffToken}`)
        .send(tableData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.table_number).toBe(tableData.table_number);

      // Clean up
      await Table.destroy({ where: { table_number: 'A04' } });
    });
  });

  describe('POST /api/admin/promos', () => {
    it('should allow admin to create promo', async () => {
      const promoData = {
        code: 'TESTPROMO',
        description: 'Test promo for admin',
        discount_type: 'percentage',
        discount_value: 10,
        min_hours: 2,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        max_uses: 100,
        is_active: true
      };

      const response = await request(app)
        .post('/api/admin/promos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(promoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe(promoData.code);

      // Clean up
      await Promo.destroy({ where: { code: 'TESTPROMO' } });
    });

    it('should reject customer from creating promo', async () => {
      const promoData = {
        code: 'CUSTOMERPROMO',
        description: 'Should not be allowed',
        discount_type: 'fixed',
        discount_value: 5000,
        min_hours: 1,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        max_uses: 50,
        is_active: true
      };

      const response = await request(app)
        .post('/api/admin/promos')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(promoData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/tables/:id', () => {
    let testTable;

    beforeAll(async () => {
      // Create a test table for update tests
      testTable = await Table.create({
        table_number: 'TEST99',
        table_type_id: testTableType.id,
        status: 'available'
      });
    });

    afterAll(async () => {
      if (testTable) {
        await testTable.destroy();
      }
    });

    it('should allow admin to update table', async () => {
      const updateData = {
        status: 'maintenance'
      };

      const response = await request(app)
        .put(`/api/admin/tables/${testTable.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should reject customer from updating table', async () => {
      const updateData = {
        status: 'available'
      };

      const response = await request(app)
        .put(`/api/admin/tables/${testTable.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/promos/:id', () => {
    let testPromo;

    beforeAll(async () => {
      // Create a test promo for delete tests
      testPromo = await Promo.create({
        code: 'DELETEME',
        description: 'Test promo for deletion',
        discount_type: 'percentage',
        discount_value: 5,
        min_hours: 1,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        max_uses: 10,
        is_active: true
      });
    });

    afterAll(async () => {
      // Promo should be deleted in test, but clean up just in case
      if (testPromo) {
        await Promo.destroy({ where: { id: testPromo.id } });
      }
    });

    it('should allow admin to delete promo', async () => {
      const response = await request(app)
        .delete(`/api/admin/promos/${testPromo.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should reject customer from deleting promo', async () => {
      // Create another promo to test delete rejection
      const anotherPromo = await Promo.create({
        code: 'NODELETE',
        description: 'Should not be deleted by customer',
        discount_type: 'fixed',
        discount_value: 2000,
        min_hours: 1,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        max_uses: 5,
        is_active: true
      });

      const response = await request(app)
        .delete(`/api/admin/promos/${anotherPromo.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Clean up
      await anotherPromo.destroy();
    });
  });

  describe('GET /api/admin/dashboard/stats', () => {
    it('should allow admin to access dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should reject customer from accessing dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated access to dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/reports/revenue', () => {
    it('should allow admin to access revenue reports', async () => {
      const response = await request(app)
        .get('/api/admin/reports/revenue')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should reject customer from accessing revenue reports', async () => {
      const response = await request(app)
        .get('/api/admin/reports/revenue')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});