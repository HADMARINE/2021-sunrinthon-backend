import PassedTeams from '@models/PassedTeams';
import { AdminAuthority } from '@util/Middleware';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  GetMapping,
  PostMapping,
  SetMiddleware,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class AdminPassedTeamsController {
  @GetMapping()
  @SetMiddleware(AdminAuthority)
  async getPassedTeams(): Promise<{ game: string[]; living: string[] } | null> {
    const teams = await PassedTeams.find();
    if (!teams.length) {
      return null;
    }

    const result: { game: string[]; living: string[] } = {
      game: [],
      living: [],
    };

    teams.forEach((v) => {
      if (v.field === '게임') {
        result.game.push(v.name);
      } else if (v.field === '생활') {
        result.living.push(v.name);
      }
    });

    return result;
  }

  @PostMapping()
  @SetMiddleware(AdminAuthority)
  async postPassedTeams(req: WrappedRequest): Promise<void> {
    const { field, name } = req.verify.body({
      field: DataTypes.string,
      name: DataTypes.string,
    });

    await PassedTeams.create({ field, name });
    return;
  }

  @DeleteMapping()
  @SetMiddleware(AdminAuthority)
  async deletePassedTeams(req: WrappedRequest): Promise<void | null> {
    const { name, field } = req.verify.query({
      name: DataTypes.string,
      field: DataTypes.string,
    });

    const result = await PassedTeams.findOneAndDelete({ name, field });

    return result ? undefined : null;
  }
}
