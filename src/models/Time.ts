import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error/ErrorDictionary';

export interface TimeInterface {
  type: string;
  value: Date;
}

const TimeSchema: Schema = new Schema({
  type: { type: String, required: true },
  value: { type: Date, required: true },
});

export interface TimeDocument extends Document, TimeInterface {}

// TimeSchema.methods.~~

TimeSchema.pre('save', function (next: HookNextFunction): void {
  const doc = this as TimeDocument;
  //   models.Time.findOne(
  //     {
  //       $or: [],
  //     },
  //     function (err: Error, site: TimeDocument) {
  //       if (site) next(error.db.exists());
  //       if (err) next(err);
  //       next();
  //     },
  //   );
});

const Time = model<TimeDocument>('Time', TimeSchema);

export default Time;
