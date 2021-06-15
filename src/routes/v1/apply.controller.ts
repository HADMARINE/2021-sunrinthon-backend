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
    const { studentId, name, teamName, position, clothSize, phoneNumber } =
      req.verify.body({
        studentId: DataTypes.string,
        name: DataTypes.string,
        teamName: DataTypes.string,
        position: DataTypes.string,
        clothSize: DataTypes.string,
        phoneNumber: DataTypes.string,
      });
    const portfolio = req.files?.portfolio as UploadedFile | undefined;

    if (!portfolio) {
      throw ErrorDictionary.data.parameterNull('portfolio (file)');
    }

    const result = await applyRepository.postApply({
      studentId,
      name,
      teamName,
      position,
      portfolio,
      clothSize,
      phoneNumber,
    });

    if (result) {
      return;
    } else {
      throw ErrorDictionary.db.create(`apply`);
    }
  }
}
