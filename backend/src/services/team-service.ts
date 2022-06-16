import Team from '../database/models/team';

export default class TeamService {
  private teamsRepository = Team;

  async findAll() {
    return this.teamsRepository.findAll();
  }

  async findById(id: number) {
    return this.teamsRepository.findByPk(id);
  }
}
