import Match from '../database/models/match';

export default class MatchService {
  private matchesRepository = Match;

  async findAll() {
    return this.matchesRepository.findAll({
      include: {
        all: true,
        attributes: { exclude: ['id'] },
      },
    });
  }
}
