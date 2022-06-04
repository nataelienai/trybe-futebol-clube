import Team from '../database/models/team';
import Match from '../database/models/match';
import UnauthorizedError from '../errors/unauthorized';
import NotFoundError from '../errors/not-found';

interface MatchFilters {
  inProgress?: boolean;
}

interface CreateMatchProps {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export default class MatchService {
  private matchesRepository = Match;

  async findAll(filters?: MatchFilters) {
    return this.matchesRepository.findAll({
      include: {
        all: true,
        attributes: { exclude: ['id'] },
      },
      ...(filters && { where: { ...filters } }),
    });
  }

  async create(match: CreateMatchProps) {
    if (match.awayTeam === match.homeTeam) {
      throw new UnauthorizedError('It is not possible to create a match with two equal teams');
    }

    const teams = await Promise.all([
      Team.findByPk(match.homeTeam),
      Team.findByPk(match.awayTeam),
    ]);

    const teamsExist = teams.every((team) => Boolean(team));
    if (!teamsExist) throw new NotFoundError('There is no team with such id!');

    return this.matchesRepository.create(match);
  }

  async setAsFinished(id: number) {
    this.matchesRepository.update({ inProgress: false }, { where: { id } });
  }
}
