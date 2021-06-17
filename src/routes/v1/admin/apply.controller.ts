import { ApplyInterface } from '@models/Apply';
import ApplyRepository from '@repo/ApplyRepository';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  GetMapping,
  SetMiddleware,
  WrappedRequest,
} from 'express-quick-builder';

const applyRepository = new ApplyRepository();

@Controller
export default class AdminApplyController {
  @GetMapping(':docid')
  @SetMiddleware(AdminAuthority)
  async getApplyOne(req: WrappedRequest): Promise<ApplyInterface | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string });
    return await applyRepository.getApplyOne({ _id: docid });
  }

  @GetMapping()
  @SetMiddleware(AdminAuthority)
  async getApply(req: WrappedRequest): Promise<ApplyInterface[] | null> {
    const {
      start,
      amount,
      teamName,
      name,
      orderBy,
      clothSize,
      studentId,
      position,
    } = req.verify.query({
      start: DataTypes.numberNull,
      amount: DataTypes.numberNull,
      teamName: DataTypes.stringNull,
      name: DataTypes.stringNull,
      orderBy: DataTypes.stringNull,
      clothSize: DataTypes.stringNull,
      studentId: DataTypes.stringNull,
      position: DataTypes.stringNull,
    });
    return await applyRepository.getApply({
      start,
      amount,
      teamName,
      name,
      orderBy,
      clothSize,
      studentId,
      position,
    });
  }

  @DeleteMapping()
  @SetMiddleware(AdminAuthority)
  async deleteApply(req: WrappedRequest): Promise<null | void> {
    const { docid } = req.verify.body({
      docid: DataTypes.string,
    });
    const result = await applyRepository.deleteApply({ _id: docid });
    return result ? undefined : null;
  }
}
