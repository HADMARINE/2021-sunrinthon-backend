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
      teamname,
      name,
      orderby,
      clothsize,
      studentid,
      position,
    } = req.verify.query({
      start: DataTypes.numberNull,
      amount: DataTypes.numberNull,
      teamname: DataTypes.stringNull,
      name: DataTypes.stringNull,
      orderby: DataTypes.stringNull,
      clothsize: DataTypes.stringNull,
      studentid: DataTypes.stringNull,
      position: DataTypes.stringNull,
    });
    return await applyRepository.getApply({
      start,
      amount,
      teamName: teamname,
      name,
      orderBy: orderby,
      clothSize: clothsize,
      studentId: studentid,
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
