import ErrorDictionary from '@error/ErrorDictionary';
import PassedTeams from '@models/PassedTeams';
import Time from '@models/Time';
import { Controller, GetMapping } from 'express-quick-builder';

@Controller
export default class PassedTeamsController {
  @GetMapping()
  async getPassedTeams(): Promise<{ game: string[]; living: string[] } | null> {
    const time = await Time.findOne({ type: 'announce_team-start' });
    if (time.value.getTime() > Date.now()) {
      throw ErrorDictionary.rule.apiNotYet();
    }
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
}
