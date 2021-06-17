import Time from '@models/Time';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  PostMapping,
  SetMiddleware,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class TimeController {
  @PostMapping('/start/hackathon')
  @SetMiddleware(AdminAuthority)
  async hackathonStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'hackathon-start' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }

  @PostMapping('/start/market')
  @SetMiddleware(AdminAuthority)
  async marketStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-start' },
      { $set: { value } },
      { upsert: true },
    ).exec();
  }

  @PostMapping('/end/hackathon')
  @SetMiddleware(AdminAuthority)
  async hackathonEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'hackathon-end' },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PostMapping('/end/hackathon')
  @SetMiddleware(AdminAuthority)
  async marketEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-end' },
      { $set: { value } },
      { upsert: true },
    );
  }
}
