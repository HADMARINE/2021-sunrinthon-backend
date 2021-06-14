import ErrorDictionary from '@error/ErrorDictionary';
import Apply, { ApplyInterface } from '@models/Apply';
import Assets, { QueryBuilder } from '@util/Assets';
import Aws from '@util/Aws';
import { UploadedFile } from 'express-fileupload';
import moment from 'moment';

export default class ApplyRepository {
  async postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
    clothSize: string;
    phoneNumber: string;
  }): Promise<boolean> {
    if (!Assets.data.verify.phone(data.phoneNumber)) {
      throw ErrorDictionary.data.parameterInvalid(`phoneNumber`);
    }

    const portFile = data.portfolio;

    if (!portFile.name.endsWith('pdf')) {
      throw ErrorDictionary.data.parameterInvalid(
        'portfolio (must end with .pdf)',
      );
    }

    const portResult = await Aws.S3.upload({
      Bucket: '2021sunrinhackathon-bigfiles',
      Key: `apply_files/${process.env.NODE_ENV}/${moment().format(
        `YYYY-MM-DD_HH_mm_ss`,
      )}_${data.teamName}_${portFile.name}`,
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
  }

  async getApply(
    data: Nullish<{
      start: number;
      amount: number;
      teamName: string;
      name: string;
      clothSize: string;
      studentId: string;
      position: string;
      orderBy: string;
    }>,
  ): Promise<ApplyInterface[] | null> {
    enum OrderBy {
      teamname,
      name,
      clothsize,
      studentid,
      position,
    }

    if (data.orderBy && !Object.keys(OrderBy).indexOf(data.orderBy)) {
      throw ErrorDictionary.data.parameterInvalid('orderby');
    }

    const apply = await Apply.find(
      QueryBuilder({
        teamName: data.teamName,
        name: data.name,
        clothSize: data.clothSize,
        studentId: data.studentId,
        position: data.position,
      }),
    )
      .skip((data?.start || 1) - 1)
      .limit(data?.amount || 10)
      .sort(data.orderBy ? `-${data.orderBy}` : undefined)
      .exec();

    return apply.length === 0 ? null : apply;
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
