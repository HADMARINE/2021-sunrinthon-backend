import PassedTeams from '@models/PassedTeams';
import {
  Controller,
  DataTypes,
  DeleteMapping,
  PostMapping,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class AdminPassedTeamsController {
  @PostMapping()
  async postPassedTeams(req: WrappedRequest): Promise<void> {
    const { field, name } = req.verify.body({
      field: DataTypes.string,
      name: DataTypes.string,
    });

    await PassedTeams.create({ field, name });
    return;
  }

  @DeleteMapping()
  async deletePassedTeams(req: WrappedRequest): Promise<void | null> {
    const { name, field } = req.verify.query({
      name: DataTypes.string,
      field: DataTypes.string,
    });

    const result = await PassedTeams.findOneAndDelete({ name, field });

    return result ? undefined : null;
  }
}
