import Match from '../database/models/match';

interface MatchFilters {
  inProgress?: boolean;
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
}
