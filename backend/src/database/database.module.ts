import { Global, Module } from '@nestjs/common';
import { Knex } from 'knex';
import knex from 'knex';
import knexConfig from '../../knexfile.config';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      useFactory: (): Knex => knex(knexConfig),
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class DatabaseModule {}
