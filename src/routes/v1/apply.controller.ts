import ErrorDictionary from '@error/ErrorDictionary';
import ApplyRepository from '@repo/ApplyRepository';
import { UploadedFile } from 'express-fileupload';
import {
  Controller,
  DataTypes,
  PostMapping,
  WrappedRequest,
} from 'express-quick-builder';

interface ApplyControllerInterface {
  postApply(req: WrappedRequest): Promise<void>;
}

const applyRepository = new ApplyRepository();

@Controller
export default class ApplyController implements ApplyControllerInterface {
  @PostMapping()
  async postApply(req: WrappedRequest): Promise<void> {
    const { studentid, name, teamname, position, clothsize } = req.verify.body({
      studentid: DataTypes.string,
      name: DataTypes.string,
      teamname: DataTypes.string,
      position: DataTypes.string,
      clothsize: DataTypes.string,
    });
    const portfolio = req.files?.portfolio as UploadedFile | undefined;

    if (!portfolio) {
      throw ErrorDictionary.data.parameterNull('portfolio (file)');
    }

    const result = await applyRepository.postApply({
      studentId: studentid,
      name,
      teamName: teamname,
      position,
      portfolio,
      clothSize: clothsize,
    });

    if (result) {
      return;
    } else {
      throw ErrorDictionary.db.create(`apply`);
    }
  }
}
