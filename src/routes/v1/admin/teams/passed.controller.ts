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

  @DeleteMapping(':id')
  async deletePassedTeams(req: WrappedRequest): Promise<void | null> {
    const { id } = req.verify.params({ id: DataTypes.string });

    const result = await PassedTeams.findByIdAndDelete(id);

    return result ? undefined : null;
  }
}
