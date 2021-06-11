import ErrorDictionary from '@error/ErrorDictionary';
import Apply, { ApplyInterface } from '@models/Apply';
import { QueryBuilder } from '@util/Assets';
import Aws from '@util/Aws';
import { UploadedFile } from 'express-fileupload';
import moment from 'moment';

interface ApplyRepositoryInterface {
  postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
    clothSize: string;
  }): Promise<boolean>;

  getApply(
    data: Nullish<{
      from: number;
      to: number;
      teamName: string;
      name: string;
    }>,
  ): Promise<ApplyInterface[]>;

  getApplyOne(data: { _id: string }): Promise<ApplyInterface | null>;

  updateApply(data: {
    _id: string;
    document: Partial<ApplyInterface>;
  }): Promise<ApplyInterface | null>;

  deleteApply(data: { _id: string }): Promise<boolean>;

  deleteApplyMany(data: { _id: string[] }): Promise<number>;
}

export default class ApplyRepository implements ApplyRepositoryInterface {
  async postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
    clothSize: string;
  }): Promise<boolean> {
    try {
      const portFile = data.portfolio;

      if (!portFile.name.endsWith('pdf')) {
        throw ErrorDictionary.data.parameterInvalid(
          'portfolio (must end with .pdf)',
        );
      }

      const portResult = await Aws.S3.upload({
        Bucket: '2021-sunrinton-files',
        Key: `apply_files/${moment().format(
          `YYYY-MM-DD_HH_mm_ss_${data.teamName}_${portFile.name}`,
        )}`,
        Body: portFile.data,
      });

      await Apply.create({
        studentId: data.studentId,
        name: data.name,
        teamName: data.teamName,
        position: data.position,
        portfolio: { Key: portResult.Key, Bucket: portResult.Bucket },
        clothSize: data.clothSize,
      });

      return true;
    } catch {
      return false;
    }
  }

  async getApply(
    data: Nullish<{
      from: number;
      to: number;
      teamName: string;
      name: string;
    }>,
  ): Promise<ApplyInterface[]> {
    const apply = await Apply.find(
      QueryBuilder({ teamName: data.teamName, name: data.name }),
    )
      .skip(data?.from || 0)
      .limit(data?.to || 10)
      .exec();

    return apply;
  }

  async getApplyOne(data: { _id: string }): Promise<ApplyInterface | null> {
    const apply = await Apply.findById(data._id).exec();
    return apply;
  }

  async updateApply(data: {
    _id: string;
    document: Partial<ApplyInterface>;
  }): Promise<ApplyInterface | null> {
    const apply = await Apply.findByIdAndUpdate(data._id, document);
    return apply;
  }

  async deleteApply(data: { _id: string }): Promise<boolean> {
    const apply = await Apply.findByIdAndDelete(data._id).exec();
    return apply ? true : false;
  }

  async deleteApplyMany(data: { _id: string[] }): Promise<number> {
    const apply = await Apply.deleteMany({ _id: { $or: data._id } }).exec();
    return apply.deletedCount || 0;
  }
}
