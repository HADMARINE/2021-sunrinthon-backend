import { ApplyInterface } from '@models/Apply';
import ApplyRepository from '@repo/ApplyRepository';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  GetMapping,
  WrappedRequest,
} from 'express-quick-builder';

const applyRepository = new ApplyRepository();

@Controller
export default class AdminApplyController {
  @GetMapping(':docid')
  async getApplyOne(req: WrappedRequest): Promise<ApplyInterface | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string });
    return await applyRepository.getApplyOne({ _id: docid });
  }

  @GetMapping()
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
  async deleteApply(req: WrappedRequest): Promise<null | void> {
    const { docid } = req.verify.body({
      docid: DataTypes.string,
    });
    const result = await applyRepository.deleteApply({ _id: docid });
    return result ? undefined : null;
  }
}
