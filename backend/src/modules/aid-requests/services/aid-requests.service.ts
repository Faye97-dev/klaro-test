import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AidRequestEntity } from '../entities/aid-request.entity';
import { AidRequestsRepository } from '../repositories/aid-requests.repository';
import { CreateAidRequestDto } from '../dto/create-aid-request.dto';
import { QueryAidRequestsDto } from '../dto/query-aid-requests.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import {
  ALLOWED_TRANSITIONS,
  MAX_ACTIVE_REQUESTS,
  PAGE_SIZE,
} from '../aid-requests.constants';
import { AidStatusEnum } from '../enums/aid-status.enum';

@Injectable()
export class AidRequestsService {
  constructor(private readonly repository: AidRequestsRepository) {}

  async create(dto: CreateAidRequestDto): Promise<AidRequestEntity> {
    const activeCount = await this.repository.countActiveByBeneficiary(
      dto.beneficiaryId,
    );

    if (activeCount >= MAX_ACTIVE_REQUESTS) {
      throw new BadRequestException(
        `A beneficiary cannot have more than ${MAX_ACTIVE_REQUESTS} active requests (PENDING or UNDER_REVIEW)`,
      );
    }

    return this.repository.create({
      beneficiaryId: dto.beneficiaryId,
      category: dto.category,
      amount: dto.amount,
      description: dto.description,
    });
  }

  async findAll(query: QueryAidRequestsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? PAGE_SIZE;

    return this.repository.findMany({
      beneficiaryId: query.beneficiaryId,
      category: query.category,
      status: query.status,
      page,
      limit,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
  ): Promise<AidRequestEntity> {
    const request = await this.repository.findById(id);

    if (!request) {
      throw new NotFoundException(`Aid request with id ${id} not found`);
    }

    if (!this.isValidStatusTransition(request.status, dto.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${request.status} to ${dto.status}`,
      );
    }

    const updated = await this.repository.updateStatus(id, dto.status);

    if (!updated) {
      throw new NotFoundException(`Aid request with id ${id} not found`);
    }

    return updated;
  }

  isValidStatusTransition(
    current: AidStatusEnum,
    next: AidStatusEnum,
  ): boolean {
    return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
  }
}
