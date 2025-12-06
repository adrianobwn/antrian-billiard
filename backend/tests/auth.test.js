import request from 'supertest';
import app from '../src/app.js';
import { Admin, Customer } from '../src/models/index.js';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../src/config/auth.js';

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/customer/register', () => {
    it('should register a new customer', async () => {
      const customerData = {
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        phone: '08123456789'
      };

      const response = await request(app)
        .post('/api/auth/customer/register')
        .send(customerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(customerData.email);
      expect(response.body.data.user.type).toBe('customer');
    });

    it('should return error for duplicate email', async () => {
      const customerData = {
        name: 'Test Customer 2',
        email: 'test@example.com', // Same email as above
        password: 'password123',
        phone: '08123456780'
      };

      const response = await request(app)
        .post('/api/auth/customer/register')
        .send(customerData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Email already registered');
    });
  });

  describe('POST /api/auth/customer/login', () => {
    it('should login existing customer', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/customer/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.type).toBe('customer');
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/customer/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/admin/login', () => {
    let adminToken;

    beforeAll(async () => {
      // Create a test admin
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
      });
    });

    it('should login existing admin', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.type).toBe('admin');
      expect(response.body.data.user.role).toBe('admin');

      adminToken = response.body.data.token;
    });

    it('should return error for invalid admin credentials', async () => {
      const loginData = {
        email: 'admin@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate valid JWT token', () => {
      const payload = {
        id: 'test-id',
        email: 'test@example.com',
        type: 'customer'
      };

      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
      });

      expect(token).toBeDefined();

      const decoded = jwt.verify(token, jwtConfig.secret);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.type).toBe(payload.type);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, jwtConfig.secret);
      }).toThrow();
    });
  });
});