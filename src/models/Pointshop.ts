import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error/ErrorDictionary';

export interface PointshopInterface {
  product: string;
  price: number;
  description: string;
}

const PointshopSchema: Schema = new Schema({
  product: String,
  price: Number,
  description: String,
});

export interface PointshopDocument extends Document, PointshopInterface {
  // Add Methods here
}

// PointshopSchema.methods.~~

PointshopSchema.pre('save', function (next: HookNextFunction): void {
  const doc = this as PointshopDocument;
  models.Pointshop.findOne(
    {
      $or: [{ product: doc.product }],
    },
    function (err: Error, site: PointshopDocument) {
      if (site) next(error.db.exists());
      if (err) next(err);
      next();
    },
  );
});

const Pointshop = model<PointshopDocument>('Pointshop', PointshopSchema);

export default Pointshop;
