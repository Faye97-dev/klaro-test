import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AidRequests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /aid-requests — validates required fields', () => {
    return request(app.getHttpServer())
      .post('/aid-requests')
      .send({})
      .expect(400);
  });

  it('POST /aid-requests — rejects invalid category', () => {
    return request(app.getHttpServer())
      .post('/aid-requests')
      .send({
        beneficiaryId: '1632d0d2-aaf3-429b-9229-5c0d79e8789a',
        category: 'INVALID',
        amount: 100,
        description: 'Test',
      })
      .expect(400);
  });

  it('POST /aid-requests — rejects amount > 5000', () => {
    return request(app.getHttpServer())
      .post('/aid-requests')
      .send({
        beneficiaryId: '1632d0d2-aaf3-429b-9229-5c0d79e8789a',
        category: 'HOUSING',
        amount: 5001,
        description: 'Test',
      })
      .expect(400);
  });

  it('GET /aid-requests — returns paginated list', () => {
    return request(app.getHttpServer())
      .get('/aid-requests')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('PATCH /aid-requests/:id/status — rejects invalid UUID', () => {
    return request(app.getHttpServer())
      .patch('/aid-requests/not-a-uuid/status')
      .send({ status: 'UNDER_REVIEW' })
      .expect(400);
  });
});
