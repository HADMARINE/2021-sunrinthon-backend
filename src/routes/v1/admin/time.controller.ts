import Time from '@models/Time';
import {
  Controller,
  DataTypes,
  PostMapping,
  WrappedRequest,
} from 'express-quick-builder';

interface TimeControllerInterface {
  hackathonTime(req: WrappedRequest): Promise<void>;
  marketTime(req: WrappedRequest): Promise<void>;
}

@Controller
export default class TimeController implements TimeControllerInterface {
  @PostMapping('/start/hackathon')
  async hackathonTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    const time = await Time.findOneAndUpdate(
      { type: 'hackathon' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }

  @PostMapping('/start/market')
  async marketTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    const time = await Time.findOneAndUpdate(
      { type: 'market' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }
}
