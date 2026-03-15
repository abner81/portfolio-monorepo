import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ScrapeActivitiesUseCase } from 'garmin-activities/application/ports/input/scrape-activities.use-case';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { ScrapeRequestDto } from 'garmin-activities/infra/adapters/driving/http/dtos/scrape-request.dto';
import { ActivityResponseDto } from 'garmin-activities/infra/adapters/driving/http/dtos/activity-response.dto';
import { ActivityHttpMapper } from 'garmin-activities/infra/adapters/driving/http/mappers/activity-http.mapper';

@Controller('garmin')
export class GarminController {
  constructor(
    @Inject(INJECTION_TOKENS.SCRAPE_ACTIVITIES_USE_CASE)
    private readonly scrapeActivitiesUseCase: ScrapeActivitiesUseCase,
  ) {}

  @Post('activities/scrape')
  async scrapeActivities(
    @Body() body: ScrapeRequestDto,
  ): Promise<ActivityResponseDto[]> {
    const result = await this.scrapeActivitiesUseCase.execute({
      from: body.from,
      to: body.to,
    });

    if (!result.ok) {
      throw new InternalServerErrorException(result.error.message);
    }

    return result.value.activities.map(ActivityHttpMapper.toResponseDto);
  }
}
