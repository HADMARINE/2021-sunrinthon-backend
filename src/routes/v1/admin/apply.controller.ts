import { ApplyInterface } from '@models/Apply';
import ApplyRepository from '@repo/ApplyRepository';
import packageSettings from '@src/../package.json';
import {
  AllMapping,
  Controller,
  DataTypes,
  GetMapping,
  PostMapping,
  SetSuccessMessage,
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
    console.log(docid);
    // return await applyRepository.getApplyOne();
    return null;
  }

  @GetMapping()
  async getApply(req: WrappedRequest): Promise<ApplyInterface[]> {
    const { from, to, teamname, name } = req.verify.body({
      from: DataTypes.numberNull,
      to: DataTypes.numberNull,
      teamname: DataTypes.stringNull,
      name: DataTypes.stringNull,
    });
    return await applyRepository.getApply({
      from,
      to,
      teamName: teamname,
      name,
    });
  }
}
