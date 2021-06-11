import { ApplyInterface } from '@models/Apply';
import ApplyRepository from '@repo/ApplyRepository';
import packageSettings from '@src/../package.json';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  GetMapping,
  WrappedRequest,
} from 'express-quick-builder';

const applyRepository = new ApplyRepository();

interface AdminApplyControllerInterface {
  getApply(req: WrappedRequest): Promise<ApplyInterface[]>;
  getApplyOne(req: WrappedRequest): Promise<ApplyInterface | null>;
}

@Controller
export default class AdminApplyController
  implements AdminApplyControllerInterface
{
  @GetMapping(':docid')
  async getApplyOne(req: WrappedRequest): Promise<ApplyInterface | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string });
    return await applyRepository.getApplyOne({ _id: docid });
  }

  @GetMapping()
  async getApply(req: WrappedRequest): Promise<ApplyInterface[]> {
    const { start, amount, teamname, name } = req.verify.query({
      start: DataTypes.numberNull,
      amount: DataTypes.numberNull,
      teamname: DataTypes.stringNull,
      name: DataTypes.stringNull,
      orderby: DataTypes.stringNull,
    });
    return await applyRepository.getApply({
      start,
      amount,
      teamName: teamname,
      name,
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
