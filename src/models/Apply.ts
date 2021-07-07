import { model, Schema, Document } from 'mongoose';
import Aws from '@util/Aws';
import ErrorDictionary from '@error/ErrorDictionary';
import mongoose_delete, { SoftDeleteModel } from 'mongoose-delete';

export interface ApplyInterface {
  studentId: string;
  name: string;
  teamName: string;
  position: string;
  clothSize: string;
  portfolio: { Bucket: string; Key: string };
}

const ApplySchema = new Schema(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    teamName: { type: String, required: true },
    position: { type: String, required: true },
    clothSize: { type: String, required: true },
    portfolio: {
      type: {
        Bucket: { type: String, required: true },
        Key: { type: String, required: true },
      },
      get: (d: ApplyInterface['portfolio']): string => {
        if (!d) throw ErrorDictionary.db.notfound();
        return Aws.S3.getSignedUrlSync({
          Bucket: d.Bucket,
          Key: d.Key,
          Expires: 300,
        });
      },
      required: true,
    },
    deleted: { type: Boolean, default: false }
  },
  {
    toObject: {
      getters: true,
      virtuals: true,
    },
    toJSON: {
      getters: true,
      virtuals: true,
    },
  },
);

ApplySchema.plugin(mongoose_delete, { overrideMethods: 'all' })

export interface ApplyDocument extends Document, ApplyInterface {
  // Add Methods here
}

// ApplySchema.methods.~~

// ApplySchema.pre('save', function (next: HookNextFunction): void {
//   const doc = this as ApplyDocument;
// models.Apply.findOne(
//   {
//     $or: [],
//   },
//   function (err: Error, site: ApplyDocument) {
//     if (site) next(error.db.exists());
//     if (err) next(err);
//     next();
//   },
// );
// });

const Apply = model<ApplyDocument>('Apply', ApplySchema);

export default Apply as SoftDeleteModel<ApplyDocument>;
