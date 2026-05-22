import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AidRequestsService } from '../services/aid-requests.service';
import { CreateAidRequestDto } from '../dto/create-aid-request.dto';
import { QueryAidRequestsDto } from '../dto/query-aid-requests.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('aid-requests')
export class AidRequestsController {
  constructor(private readonly aidRequestsService: AidRequestsService) {}

  @Post()
  create(@Body() dto: CreateAidRequestDto) {
    return this.aidRequestsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryAidRequestsDto) {
    return this.aidRequestsService.findAll(query);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.aidRequestsService.updateStatus(id, dto);
  }
}
