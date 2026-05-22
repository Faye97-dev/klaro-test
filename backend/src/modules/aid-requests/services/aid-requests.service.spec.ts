import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AidRequestsService } from '../services/aid-requests.service';
import { AidRequestsRepository } from '../repositories/aid-requests.repository';
import { AidCategoryEnum } from '../enums/aid-category.enum';
import { AidStatusEnum } from '../enums/aid-status.enum';

describe('AidRequestsService', () => {
  let service: AidRequestsService;
  let repository: jest.Mocked<AidRequestsRepository>;

  const mockRequest = {
    id: '5a7f835e-a69c-42c7-9c8e-8b433e1ebead',
    beneficiaryId: '8337c1da-cd02-43f6-a653-4cf636a3b610',
    category: AidCategoryEnum.HOUSING,
    amount: '100.00',
    description: 'Rent assistance',
    status: AidStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AidRequestsService,
        {
          provide: AidRequestsRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findMany: jest.fn(),
            countActiveByBeneficiary: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AidRequestsService);
    repository = module.get(AidRequestsRepository);
  });

  describe('status transitions', () => {
    it('allows PENDING to UNDER_REVIEW', () => {
      expect(
        service.isValidStatusTransition(
          AidStatusEnum.PENDING,
          AidStatusEnum.UNDER_REVIEW,
        ),
      ).toBe(true);
    });

    it('rejects PENDING to APPROVED', () => {
      expect(
        service.isValidStatusTransition(
          AidStatusEnum.PENDING,
          AidStatusEnum.APPROVED,
        ),
      ).toBe(false);
    });

    it('throws 400 on invalid transition', async () => {
      repository.findById.mockResolvedValue(mockRequest);

      await expect(
        service.updateStatus(mockRequest.id, {
          status: AidStatusEnum.APPROVED,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('allows UNDER_REVIEW to APPROVED', async () => {
      repository.findById.mockResolvedValue({
        ...mockRequest,
        status: AidStatusEnum.UNDER_REVIEW,
      });
      repository.updateStatus.mockResolvedValue({
        ...mockRequest,
        status: AidStatusEnum.APPROVED,
      });

      const result = await service.updateStatus(mockRequest.id, {
        status: AidStatusEnum.APPROVED,
      });

      expect(result.status).toBe(AidStatusEnum.APPROVED);
    });
  });

  describe('active requests limit', () => {
    it('rejects creation when beneficiary has 2 active requests', async () => {
      repository.countActiveByBeneficiary.mockResolvedValue(2);

      await expect(
        service.create({
          beneficiaryId: mockRequest.beneficiaryId,
          category: AidCategoryEnum.FOOD,
          amount: 50,
          description: 'Food aid',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('not found', () => {
    it('throws 404 when request does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus('5f25727c-c286-4207-bd80-010dccde01e1', {
          status: AidStatusEnum.UNDER_REVIEW,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
