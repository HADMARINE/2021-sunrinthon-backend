import Setting from '@models/Setting';
import {
  Controller,
  DataTypes,
  GetMapping,
  PostMapping,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class AdminSettingsController {
  @GetMapping('time-display-key')
  async getTimeDisplayKeyValue(): Promise<string | null> {
    const setting = await Setting.findOne({ key: 'time-display-key' });
    if (!setting) {
      return null;
    }
    return setting.value;
  }

  @PostMapping('time-display-key')
  async setTimeDisplayKey(req: WrappedRequest): Promise<void | null> {
    const { value } = req.verify.body({ value: DataTypes.string });
    await Setting.findOneAndUpdate(
      { key: 'time-display-key' },
      { $set: { value } },
      { upsert: true },
    );
  }
}
