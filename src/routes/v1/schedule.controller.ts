import Setting from '@models/Setting';
import Aws from '@util/Aws';
import { Controller, GetMapping } from 'express-quick-builder';

@Controller
export default class ScheduleController {
  @GetMapping()
  async getScheduleImage(): Promise<string | null> {
    const scheduleValue: string | undefined = (
      await Setting.findOne({ key: 'schedule-image-location' })
    )?.value;
    if (!scheduleValue) return null;
    const schedule: { Key: string; Bucket: string } = JSON.parse(scheduleValue);

    return await Aws.S3.getSignedUrl({ ...schedule });
  }
}
