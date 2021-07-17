import Pointshop from '@models/Pointshop';
import Aws from '@util/Aws';
import { Controller, GetMapping } from 'express-quick-builder';

@Controller
export default class PointshopController {
  @GetMapping()
  async getPointValues(): Promise<Record<string, any>[] | null> {
    const scheduleValue = await Pointshop.find().sort('-_id');
    if (!scheduleValue.length) return null;
    return scheduleValue;
  }
}
