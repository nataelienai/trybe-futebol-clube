import Team from '../database/models/team';

export default class TeamService {
  private teamsRepository = Team;

  async findAll() {
    const teams = await this.teamsRepository.findAll();
    return teams;
  }
}
