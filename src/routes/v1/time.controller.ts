import Time from '@models/Time';
import { Controller, GetMapping } from 'express-quick-builder';

@Controller
export default class AdminTimeController {
  @GetMapping('/start')
  async getAllStartTime(): Promise<{
    hackathon: Date;
    market: Date;
    announce_team: Date;
  } | null> {
    const hackathon = await Time.findOne({ type: 'hackathon-start' });
    const market = await Time.findOne({ type: 'market-start' });
    const announce_team = await Time.findOne({ type: 'announce_team-start' });
    if (!hackathon || !market || !announce_team) return null;
    return {
      hackathon: new Date(hackathon.value),
      market: new Date(market.value),
      announce_team: new Date(announce_team.value),
    };
  }

  @GetMapping('/end')
  async getAllEndTime(): Promise<{ hackathon: Date; market: Date } | null> {
    const hackathon = await Time.findOne({ type: 'hackathon-end' }).exec();
    const market = await Time.findOne({ type: 'market-end' }).exec();
    if (!hackathon || !market) return null;
    return {
      hackathon: new Date(hackathon.value),
      market: new Date(market.value),
    };
  }

  @GetMapping('/start/hackathon')
  async hackathonStartTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'hackathon-start' }).exec();
    return time ? time.value : null;
  }

  @GetMapping('/start/market')
  async marketStartTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'market-start' }).exec();
    return time ? time.value : null;
  }

  @GetMapping('/start/announce/team')
  async teamAnnounceStartTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'announce_team-start' });
    return time ? time.value : null;
  }

  @GetMapping('/end/hackathon')
  async hackathonTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'hackathon-end' }).exec();
    return time ? time.value : null;
  }

  @GetMapping('/end/market')
  async marketTime(): Promise<Date | null> {
    const time = await Time.findOne({ type: 'market-end' }).exec();
    return time ? time.value : null;
  }
}
