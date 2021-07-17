import Pointshop from '@models/Pointshop';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  PutMapping,
  SetMiddleware,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class PointshopController {
  @PutMapping()
  @SetMiddleware(AdminAuthority)
  async create(req: WrappedRequest): Promise<void> {
    const { product, price, description } = req.verify.body({
      product: DataTypes.string,
      price: DataTypes.number,
      description: DataTypes.string,
    });

    await Pointshop.findOneAndUpdate(
      { product },
      { $set: { price, description } },
      { upsert: true },
    );
  }

  @DeleteMapping(':product')
  @SetMiddleware(AdminAuthority)
  async delete(req: WrappedRequest): Promise<void | null> {
    const { product } = req.verify.params({ product: DataTypes.string });
    const res = await Pointshop.findOneAndDelete({ product });
    if (!res) return null;
    return;
  }
}
