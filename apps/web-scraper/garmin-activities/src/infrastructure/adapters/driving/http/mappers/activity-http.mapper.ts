import { Activity } from 'garmin-activities/domain/entities/activity.entity';
import { ActivityResponseDto } from 'garmin-activities/infra/adapters/driving/http/dtos/activity-response.dto';

export class ActivityHttpMapper {
  static toResponseDto(activity: Activity): ActivityResponseDto {
    const dto = new ActivityResponseDto();
    dto.id = activity.getId().toString();
    dto.type = activity.getType().toString();
    dto.durationSeconds = activity.getDuration().toSeconds();
    dto.startedAtIso = activity.getStartedAt().toISOString();
    return dto;
  }
}
