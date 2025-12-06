import request from 'supertest';
import app from '../src/app.js';
import { Customer, Table, TableType, Reservation } from '../src/models/index.js';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../src/config/auth.js';

describe('Reservation CRUD Operations', () => {
  let customerToken;
  let adminToken;
  let testCustomer;
  let testTable;
  let testTableType;

  beforeAll(async () => {
    // Create test table type
    testTableType = await TableType.create({
      name: 'Standard Test',
      hourly_rate: 50000,
      description: 'Test table type'
    });

    // Create test table
    testTable = await Table.create({
      table_number: 'T99',
      table_type_id: testTableType.id,
      status: 'available'
    });

    // Create test customer
    testCustomer = await Customer.create({
      name: 'Test Customer',
      email: 'testcustomer@example.com',
      password: 'password123',
      phone: '08123456789'
    });

    // Generate tokens
    customerToken = jwt.sign(
      { id: testCustomer.id, email: testCustomer.email, type: 'customer' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Create test admin for admin token
    const testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    adminToken = jwt.sign(
      { id: testAdmin.id, email: testAdmin.email, type: 'admin', role: 'admin' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  });

  afterAll(async () => {
    // Clean up created data
    await Reservation.destroy({ where: {} });
    await Customer.destroy({ where: { email: 'testcustomer@example.com' } });
    await Admin.destroy({ where: { email: 'testadmin@example.com' } });
    await Table.destroy({ where: { table_number: 'T99' } });
    await TableType.destroy({ where: { name: 'Standard Test' } });
  });

  describe('POST /api/reservations', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        table_id: testTable.id,
        start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        end_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
        notes: 'Test reservation'
      };

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(reservationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Reservation created successfully');
      expect(response.body.data.table_id).toBe(reservationData.table_id);
      expect(response.body.data.customer_id).toBe(testCustomer.id);
      expect(response.body.data.status).toBe('pending');
    });

    it('should reject reservation without authentication', async () => {
      const reservationData = {
        table_id: testTable.id,
        start_time: new Date(Date.now() + 3600000).toISOString(),
        end_time: new Date(Date.now() + 7200000).toISOString()
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject reservation for invalid time range', async () => {
      const reservationData = {
        table_id: testTable.id,
        start_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
        end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now (invalid)
      };

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(reservationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reservations', () => {
    let testReservation;

    beforeAll(async () => {
      // Create a test reservation for get tests
      testReservation = await Reservation.create({
        customer_id: testCustomer.id,
        table_id: testTable.id,
        start_time: new Date(Date.now() + 3600000),
        end_time: new Date(Date.now() + 7200000),
        duration_hours: 1,
        base_cost: 50000,
        discount: 0,
        final_cost: 50000,
        status: 'pending',
        notes: 'Test reservation for GET'
      });
    });

    afterAll(async () => {
      // Clean up test reservation
      if (testReservation) {
        await testReservation.destroy();
      }
    });

    it('should get customer reservations', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get all reservations for admin', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should reject unauthenticated access', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reservations/:id', () => {
    let testReservation;

    beforeAll(async () => {
      testReservation = await Reservation.create({
        customer_id: testCustomer.id,
        table_id: testTable.id,
        start_time: new Date(Date.now() + 3600000),
        end_time: new Date(Date.now() + 7200000),
        duration_hours: 1,
        base_cost: 50000,
        discount: 0,
        final_cost: 50000,
        status: 'confirmed',
        notes: 'Test reservation for GET by ID'
      });
    });

    afterAll(async () => {
      if (testReservation) {
        await testReservation.destroy();
      }
    });

    it('should get reservation by ID for owner', async () => {
      const response = await request(app)
        .get(`/api/reservations/${testReservation.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testReservation.id);
    });

    it('should get reservation by ID for admin', async () => {
      const response = await request(app)
        .get(`/api/reservations/${testReservation.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testReservation.id);
    });

    it('should return 404 for non-existent reservation', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/reservations/${fakeId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/reservations/:id', () => {
    let testReservation;

    beforeEach(async () => {
      testReservation = await Reservation.create({
        customer_id: testCustomer.id,
        table_id: testTable.id,
        start_time: new Date(Date.now() + 3600000),
        end_time: new Date(Date.now() + 7200000),
        duration_hours: 1,
        base_cost: 50000,
        discount: 0,
        final_cost: 50000,
        status: 'pending',
        notes: 'Test reservation for UPDATE'
      });
    });

    afterEach(async () => {
      if (testReservation) {
        await testReservation.destroy();
      }
    });

    it('should update reservation by owner', async () => {
      const updateData = {
        status: 'confirmed',
        notes: 'Updated reservation notes'
      };

      const response = await request(app)
        .put(`/api/reservations/${testReservation.id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.notes).toBe(updateData.notes);
    });

    it('should update reservation by admin', async () => {
      const updateData = {
        status: 'cancelled',
        notes: 'Cancelled by admin'
      };

      const response = await request(app)
        .put(`/api/reservations/${testReservation.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should reject update from unauthorized user', async () => {
      // Create another customer
      const otherCustomer = await Customer.create({
        name: 'Other Customer',
        email: 'other@example.com',
        password: 'password123',
        phone: '08123456780'
      });

      const otherToken = jwt.sign(
        { id: otherCustomer.id, email: otherCustomer.email, type: 'customer' },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      const updateData = {
        status: 'confirmed'
      };

      const response = await request(app)
        .put(`/api/reservations/${testReservation.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Clean up
      await otherCustomer.destroy();
    });
  });

  describe('Table Availability', () => {
    it('should check table availability', async () => {
      const checkData = {
        table_id: testTable.id,
        start_time: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
        end_time: new Date(Date.now() + 14400000).toISOString() // 4 hours from now
      };

      const response = await request(app)
        .post('/api/reservations/check-availability')
        .send(checkData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true);
    });

    it('should detect table conflict for overlapping times', async () => {
      // Create a reservation
      const existingReservation = await Reservation.create({
        customer_id: testCustomer.id,
        table_id: testTable.id,
        start_time: new Date(Date.now() + 18000000), // 5 hours from now
        end_time: new Date(Date.now() + 21600000), // 6 hours from now
        duration_hours: 1,
        base_cost: 50000,
        discount: 0,
        final_cost: 50000,
        status: 'confirmed'
      });

      const checkData = {
        table_id: testTable.id,
        start_time: new Date(Date.now() + 19000000).toISOString(), // Overlapping time
        end_time: new Date(Date.now() + 20000000).toISOString()
      };

      const response = await request(app)
        .post('/api/reservations/check-availability')
        .send(checkData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(false);

      // Clean up
      await existingReservation.destroy();
    });
  });
});