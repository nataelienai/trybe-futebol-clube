import Match from '../database/models/match';

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
    return this.matchesRepository.create(match);
  }
}
