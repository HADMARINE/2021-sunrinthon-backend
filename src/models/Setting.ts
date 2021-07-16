import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error/ErrorDictionary';

export interface SettingInterface {
  key: string;
  value: string;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

export interface SettingDocument extends Document, SettingInterface {
  // Add Methods here
}

// SettingSchema.methods.~~

SettingSchema.pre('save', function (next: HookNextFunction): void {
  const doc = this as SettingDocument;
  models.Setting.findOne(
    {
      $or: [{ key: doc.key }],
    },
    function (err: Error, site: SettingDocument) {
      if (site) next(error.db.exists());
      if (err) next(err);
      next();
    },
  );
});

const Setting = model<SettingDocument>('Setting', SettingSchema);

export default Setting;
