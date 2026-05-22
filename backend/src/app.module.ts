import { Module } from '@nestjs/common';
import { AidRequestsModule } from './modules/aid-requests/aid-requests.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AidRequestsModule],
})
export class AppModule {}
