import ErrorDictionary from '@error/ErrorDictionary';
import { ApplyInterface } from '@models/Apply';
import ApplyRepository from '@repo/ApplyRepository';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  GetMapping,
  SetMiddleware,
  UseCustomHandler,
  WrappedRequest,
} from 'express-quick-builder';
import { Request, Response } from 'express';

const applyRepository = new ApplyRepository();

@Controller
export default class AdminApplyController {
  @GetMapping(':docid')
  @SetMiddleware(AdminAuthority)
  async getApplyOne(req: WrappedRequest): Promise<ApplyInterface | null> {
    const { docid } = req.verify.params({ docid: DataTypes.string });
    return await applyRepository.getApplyOne({ _id: docid });
  }

  @GetMapping()
  @SetMiddleware(AdminAuthority)
  async getApply(
    req: WrappedRequest,
  ): Promise<{
    docs: Omit<ApplyInterface, 'portfolio'>[];
    length: number;
  } | null> {
    const {
      start,
      amount,
      teamName,
      name,
      orderBy,
      clothSize,
      studentId,
      position,
    } = req.verify.query({
      start: DataTypes.numberNull,
      amount: DataTypes.numberNull,
      teamName: DataTypes.stringNull,
      name: DataTypes.stringNull,
      orderBy: DataTypes.stringNull,
      clothSize: DataTypes.stringNull,
      studentId: DataTypes.stringNull,
      position: DataTypes.stringNull,
    });
    return await applyRepository.getApplyExcludePortfolio({
      start,
      amount,
      teamName,
      name,
      orderBy,
      clothSize,
      studentId,
      position,
    });
  }

  @GetMapping('/portfolio/redirect/:id')
  @SetMiddleware(AdminAuthority)
  @UseCustomHandler
  async getPortfolioByIdRedirect(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const url = await applyRepository.getPortfolioById({ _id: id });
    if (!url) throw ErrorDictionary.db.notfound();
    res.redirect(url);
  }

  @GetMapping('/portfolio/:id')
  @SetMiddleware(AdminAuthority)
  async getPortfolioById(req: WrappedRequest): Promise<string> {
    const { id } = req.verify.params({ id: DataTypes.string });
    const url = await applyRepository.getPortfolioById({ _id: id });
    if (!url) throw ErrorDictionary.db.notfound();
    return url;
  }

  @DeleteMapping(':id')
  @SetMiddleware(AdminAuthority)
  async deleteApply(req: WrappedRequest): Promise<null | void> {
    const { id } = req.verify.params({
      id: DataTypes.string,
    });
    const result = await applyRepository.deleteApply({ _id: id });
    return result ? undefined : null;
  }
}
