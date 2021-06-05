import ErrorDictionary from '@error/ErrorDictionary';
import ApplyRepository from '@repo/ApplyRepository';
import { UploadedFile } from 'express-fileupload';
import { Controller, DataTypes, WrappedRequest } from 'express-quick-builder';

interface ApplyControllerInterface {
  postApply(req: WrappedRequest): Promise<void>;
}

const applyRepository = new ApplyRepository();

@Controller
export default class ApplyController implements ApplyControllerInterface {
  async postApply(req: WrappedRequest): Promise<void> {
    const { studentid, name, teamname, position } = req.verify.body({
      studentid: DataTypes.string,
      name: DataTypes.string,
      teamname: DataTypes.string,
      position: DataTypes.string,
    });
    const portfolio = req.files?.portfolio as UploadedFile | undefined;

    if (!portfolio) {
      throw ErrorDictionary.data.parameterNull('portfolio (file)');
    }

    applyRepository.postApply({
      studentId: studentid,
      name,
      teamName: teamname,
      position,
      portfolio,
    });
  }
}
