import Time from '@models/Time';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  GetMapping,
  PostMapping,
  SetMiddleware,
  SetSuccessMessage,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class TimeController {
  @GetMapping('list')
  @SetMiddleware(AdminAuthority)
  async getTimeKeyList(): Promise<string[] | null> {
    const result = (await Time.find()).map((doc) => doc.type);
    if (result.length === 0) return null;
    return result;
  }

  @GetMapping(':type')
  @SetMiddleware(AdminAuthority)
  async getTimeValueByType(req: WrappedRequest): Promise<Date | null> {
    const { type } = req.verify.params({ type: DataTypes.string });
    const time = await Time.findOne({ type });
    if (!time) return null;
    return time.value;
  }

  // Find time value by key and update. if not exists, create new column with got value
  @PostMapping()
  @SetMiddleware(AdminAuthority)
  async setTimeValue(req: WrappedRequest): Promise<void> {
    const { type, value, label } = req.verify.body({
      type: DataTypes.string,
      value: DataTypes.date,
      label: DataTypes.string,
    });

    await Time.findOneAndUpdate(
      { type },
      { $set: { value, label } },
      { upsert: true },
    );
  }

  @PostMapping('/start/hackathon')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('This API will be deprecated soon. REPLACE NOW!')
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
  @SetSuccessMessage('This API will be deprecated soon. REPLACE NOW!')
  async marketStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-start' },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PostMapping('/start/announce/team')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('This API will be deprecated soon. REPLACE NOW!')
  async announceTeamStartTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      {
        type: 'announce_team-start',
      },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PostMapping('/end/hackathon')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('This API will be deprecated soon. REPLACE NOW!')
  async hackathonEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'hackathon-end' },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PostMapping('/end/market')
  @SetMiddleware(AdminAuthority)
  @SetSuccessMessage('This API will be deprecated soon. REPLACE NOW!')
  async marketEndTime(req: WrappedRequest): Promise<void> {
    const { value } = req.verify.body({ value: DataTypes.date });
    await Time.findOneAndUpdate(
      { type: 'market-end' },
      { $set: { value } },
      { upsert: true },
    );
  }
}
