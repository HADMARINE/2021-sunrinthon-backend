import ErrorDictionary from '@error/ErrorDictionary';
import Setting from '@models/Setting';
import Aws from '@util/Aws';
import { AdminAuthority } from '@util/Middleware';
import { UploadedFile } from 'express-fileupload';
import {
  Controller,
  DataTypes,
  GetMapping,
  PostMapping,
  PutMapping,
  SetMiddleware,
  WrappedRequest,
} from 'express-quick-builder';
import moment from 'moment';

@Controller
export default class AdminSettingsController {
  @GetMapping('time-display-key')
  @SetMiddleware(AdminAuthority)
  async getTimeDisplayKeyValue(): Promise<string | null> {
    const setting = await Setting.findOne({ key: 'time-display-key' });
    if (!setting) {
      return null;
    }
    return setting.value;
  }

  @PostMapping('time-display-key')
  @SetMiddleware(AdminAuthority)
  async setTimeDisplayKey(req: WrappedRequest): Promise<void | null> {
    const { value } = req.verify.body({ value: DataTypes.string });
    await Setting.findOneAndUpdate(
      { key: 'time-display-key' },
      { $set: { value } },
      { upsert: true },
    );
  }

  @PutMapping('schedule')
  @SetMiddleware(AdminAuthority)
  async setSchedule(req: WrappedRequest): Promise<void> {
    const file = req.files?.value;
    if (Array.isArray(file)) {
      throw ErrorDictionary.data.parameterInvalid('file (must not be array)');
    }

    if (!file) {
      throw ErrorDictionary.data.parameterNull('value (file)');
    }
    const fileName = `${file.name}_${moment().format(`YYYY-MM-DD_HH_mm_ss`)}}`;
    const fileUploadResult = await Aws.S3.upload({
      Bucket: 'sunrinhackathon-bigfiles',
      Key: `serve/settings/${fileName}`,
      Body: Buffer.from(file.data),
      ContentType: file.mimetype,
    });

    const doc = { Key: fileUploadResult.Key, Bucket: fileUploadResult.Bucket };

    await Setting.findOneAndUpdate(
      { key: 'schedule-image-location' },
      { value: JSON.stringify(doc) },
      {
        upsert: true,
      },
    );
  }
}
