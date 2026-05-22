import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../../database/database.module';
import { AidRequestEntity } from '../entities/aid-request.entity';
import { AidCategoryEnum } from '../enums/aid-category.enum';
import { AidStatusEnum } from '../enums/aid-status.enum';
import { ACTIVE_STATUSES } from '../aid-requests.constants';
import { AidRequestRow, CountRow } from '../aid-requests.interface';

@Injectable()
export class AidRequestsRepository {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private toEntity(row: AidRequestRow): AidRequestEntity {
    return {
      id: row.id,
      beneficiaryId: row.beneficiary_id,
      category: row.category,
      amount: row.amount,
      description: row.description,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(data: {
    beneficiaryId: string;
    category: AidCategoryEnum;
    amount: number;
    description: string;
  }): Promise<AidRequestEntity> {
    const [row] = await this.knex<AidRequestRow>('aid_requests')
      .insert({
        beneficiary_id: data.beneficiaryId,
        category: data.category,
        amount: String(data.amount),
        description: data.description,
        status: AidStatusEnum.PENDING,
      })
      .returning('*');

    return this.toEntity(row);
  }

  async findById(id: string): Promise<AidRequestEntity | null> {
    const row = await this.knex<AidRequestRow>('aid_requests')
      .where({ id })
      .first();

    return row ? this.toEntity(row) : null;
  }

  async findMany(filters: {
    beneficiaryId?: string;
    status?: AidStatusEnum;
    category?: AidCategoryEnum;
    page: number;
    limit: number;
  }): Promise<{ data: AidRequestEntity[]; total: number }> {
    const query = this.knex<AidRequestRow>('aid_requests');

    if (filters.beneficiaryId) {
      query.where('beneficiary_id', filters.beneficiaryId);
    }
    if (filters.status) {
      query.where('status', filters.status);
    }
    if (filters.category) {
      query.where('category', filters.category);
    }

    const countResult = (await query.clone().count('* as count').first()) as
      | CountRow
      | undefined;
    const total = Number(countResult?.count ?? 0);

    const rows = await query
      .orderBy('created_at', 'desc')
      .offset((filters.page - 1) * filters.limit)
      .limit(filters.limit);

    return {
      data: rows.map((row) => this.toEntity(row)),
      total,
    };
  }

  async countActiveByBeneficiary(beneficiaryId: string): Promise<number> {
    const result = (await this.knex('aid_requests')
      .where('beneficiary_id', beneficiaryId)
      .whereIn('status', ACTIVE_STATUSES)
      .count('* as count')
      .first()) as CountRow | undefined;

    return Number(result?.count ?? 0);
  }

  async updateStatus(
    id: string,
    status: AidStatusEnum,
  ): Promise<AidRequestEntity | null> {
    const [row] = await this.knex<AidRequestRow>('aid_requests')
      .where({ id })
      .update({
        status,
        updated_at: this.knex.fn.now(),
      })
      .returning('*');

    return row ? this.toEntity(row) : null;
  }
}
