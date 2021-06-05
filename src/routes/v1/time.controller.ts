import Time from '@models/Time';
import { Controller, GetMapping } from 'express-quick-builder';

interface AdminTimeControllerInterface {
  hackathonTime(): Promise<Date | null>;
  marketTime(): Promise<Date | null>;
}

@Controller
export default class AdminTimeController
  implements AdminTimeControllerInterface
{
  @GetMapping('/start/hackathon')
  async hackathonTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'hackathon' }).exec();
    return time ? time.value : null;
  }

  @GetMapping('/start/market')
  async marketTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'market' }).exec();
    return time ? time.value : null;
  }
}
