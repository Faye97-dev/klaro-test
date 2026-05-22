import { Module } from '@nestjs/common';
import { AidRequestsController } from './controllers/aid-requests.controller';
import { AidRequestsRepository } from './repositories/aid-requests.repository';
import { AidRequestsService } from './services/aid-requests.service';

@Module({
  controllers: [AidRequestsController],
  providers: [AidRequestsService, AidRequestsRepository],
})
export class AidRequestsModule {}
