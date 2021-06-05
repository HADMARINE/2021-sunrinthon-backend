import Apply, { ApplyInterface } from '@models/Apply';
import { QueryBuilder } from '@util/Assets';
import Aws from '@util/Aws';
import { UploadedFile } from 'express-fileupload';
import moment from 'moment';
import { ObjectId } from 'mongoose';

interface ApplyRepositoryInterface {
  postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
  }): Promise<boolean>;

  getApply(
    data: Nullish<{
      from: number;
      to: number;
      teamName: string;
      name: string;
    }>,
  ): Promise<ApplyInterface[]>;

  getApplyOne(data: { _id: ObjectId }): Promise<ApplyInterface | null>;

  updateApply(data: {
    _id: ObjectId;
    document: Partial<ApplyInterface>;
  }): Promise<ApplyInterface | null>;

  deleteApply(data: { _id: ObjectId }): Promise<boolean>;

  deleteApplyMany(data: { _id: ObjectId[] }): Promise<number>;
}

export default class ApplyRepository implements ApplyRepositoryInterface {
  async postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
  }): Promise<boolean> {
    try {
      const portFile = data.portfolio;

      const portResult = await Aws.S3.upload({
        Bucket: '2021-sunrinton-files',
        Key: `apply_files/${data.teamName}_${portFile.name}_${moment().format(
          `YYYY-MM-DD_HH_mm_ss`,
        )}`,
        Body: portFile.data,
      });

      await Apply.create({
        studentId: data.studentId,
        name: data.name,
        teamName: data.teamName,
        position: data.position,
        portfolio: { Key: portResult.Key, Bucket: portResult.Bucket },
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

  async getApplyOne(data: { _id: ObjectId }): Promise<ApplyInterface | null> {
    const apply = await Apply.findById(data._id).exec();
    return apply;
  }

  async updateApply(data: {
    _id: ObjectId;
    document: Partial<ApplyInterface>;
  }): Promise<ApplyInterface | null> {
    const apply = await Apply.findOneAndUpdate(data._id, document);
    return apply;
  }

  async deleteApply(data: { _id: ObjectId }): Promise<boolean> {
    const apply = await Apply.findByIdAndDelete(data._id).exec();
    return apply ? true : false;
  }

  async deleteApplyMany(data: { _id: ObjectId[] }): Promise<number> {
    const apply = await Apply.deleteMany({ _id: { $or: data._id } }).exec();
    return apply.deletedCount || 0;
  }
}
