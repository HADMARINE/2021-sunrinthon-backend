import ErrorDictionary from '@error/ErrorDictionary';
import Apply, { ApplyInterface } from '@models/Apply';
import Assets, { QueryBuilder } from '@util/Assets';
import Aws from '@util/Aws';
import { UploadedFile } from 'express-fileupload';
import moment from 'moment';
import logger from 'clear-logger';

export default class ApplyRepository {
  async postApply(data: {
    studentId: string;
    name: string;
    teamName: string;
    position: string;
    portfolio: UploadedFile;
    clothSize: string;
    phoneNumber: string;
    field: string;
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

    let portResult;
    const fileName = `${process.env.DB_ENV === 'development' ||
      process.env.NODE_ENV !== 'production'
      ? 'development'
      : 'production'
      }/${moment().format(
        `YYYY-MM-DD_HH_mm_ss`,
      )}_${`${data.teamName}_${data.name}`.replace(/([/])/, '')}.pdf`;
    try {
      portResult = await Aws.S3.uploadAccelerate({
        Bucket: 'sunrinhackathon-bigfiles',
        Key: `apply_files/${fileName}`,
        Body: Buffer.from(portFile.data),
        ContentType: portFile.mimetype,
      });
    } catch (e) {
      logger.debug(e);
      throw ErrorDictionary.db.error();
    }

    await Apply.create({
      studentId: data.studentId,
      name: data.name,
      teamName: data.teamName,
      position: data.position,
      portfolio: { Key: portResult.Key, Bucket: portResult.Bucket },
      clothSize: data.clothSize,
      phoneNumber: data.phoneNumber,
      field: data.field
    });

    return true;
  }

  async getApplyExcludePortfolio(
    data: Nullish<{
      start: number;
      amount: number;
      teamName: string;
      name: string;
      clothSize: string;
      studentId: string;
      position: string;
      orderBy: string;
      field: string;
      phoneNumber: string;
    }>,
  ): Promise<{
    docs: Omit<ApplyInterface, 'portfolio'>[];
    length: number;
  } | null> {
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

    const query = QueryBuilder({
      teamName: data.teamName,
      name: data.name,
      clothSize: data.clothSize,
      studentId: data.studentId,
      position: data.position,
      field: data.field,
      phoneNumber: data.phoneNumber
    });

    const apply = await Apply.find(query)
      .skip((data?.start || 1) - 1)
      .limit(data?.amount || 10)
      .sort(data.orderBy ? `-${data.orderBy}` : undefined)
      .select('-portfolio -__v -deleted')
      .exec();

    const length = await Apply.countDocuments(query);

    return apply.length === 0 ? null : { docs: apply, length };
  }

  async getPortfolioById(data: { _id: string }): Promise<string | null> {
    const apply = await Apply.findById(data._id);
    if (!apply) return null;
    return apply.portfolio as unknown as string;
  }

  async getApplyOne(data: { _id: string }): Promise<ApplyInterface | null> {
    const apply = await Apply.findById(data._id);
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
    const apply = await Apply.deleteById(data._id);
    return apply ? true : false;
  }

  async deleteApplyMany(data: { _id: string[] }): Promise<number> {
    const apply = await Apply.deleteMany({ _id: { $or: data._id } });
    return apply.deletedCount || 0;
  }
}
