import Time from '@models/Time';
import { Controller, GetMapping } from 'express-quick-builder';

interface AdminTimeControllerInterface {
  getAllTime(): Promise<{ hackathon: Date; market: Date } | null>;
  hackathonTime(): Promise<Date | null>;
  marketTime(): Promise<Date | null>;
}

@Controller
export default class AdminTimeController
  implements AdminTimeControllerInterface
{
  @GetMapping('/start')
  async getAllTime(): Promise<{ hackathon: Date; market: Date } | null> {
    const hackathon = await Time.findOne({ type: 'hackathon' }).exec();
    const market = await Time.findOne({ type: 'market' }).exec();
    if (!hackathon || !market) return null;
    return {
      hackathon: new Date(hackathon.value),
      market: new Date(market.value),
    };
  }

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
