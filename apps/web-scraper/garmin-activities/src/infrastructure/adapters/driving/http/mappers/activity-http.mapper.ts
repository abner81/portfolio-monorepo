import { Activity } from '@domain/entities/activity.entity';
import { ActivityResponseDto } from '@infrastructure/adapters/driving/http/dtos/activity-response.dto';

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
