import Time from '@models/Time';
import {
  Controller,
  DataTypes,
  PostMapping,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class TimeController {
  @PostMapping('/start/hackathon')
  async hackathonStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'hackathon-start' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }

  @PostMapping('/start/market')
  async marketStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-start' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }

  @PostMapping('/end/hackathon')
  async hackathonEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'hackathon-end' },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PostMapping('/end/hackathon')
  async marketEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-end' },
      { $set: { value } },
      { upsert: true },
    );
  }
}
