import Team from '../database/models/team';
import Match from '../database/models/match';

interface StatsForAllMatches {
  goalsFavor: number;
  goalsOwn: number;
  totalVictories: number;
  totalLosses: number;
  totalDraws: number;
}

interface OverallTeamStats extends StatsForAllMatches {
  name: string;
  totalGames: number;
  totalPoints: number;
  goalsBalance: number;
  efficiency: number;
}

type GetStatsFunction = (team: Team, match: Match[]) => StatsForAllMatches;

function getHomeTeamStats(team: Team, matches: Match[]): StatsForAllMatches {
  return matches
    .filter((match) => match.homeTeam === team.id)
    .reduce((
      { goalsFavor, goalsOwn, totalDraws, totalLosses, totalVictories },
      { homeTeamGoals, awayTeamGoals },
    ) => ({
      goalsFavor: goalsFavor + homeTeamGoals,
      goalsOwn: goalsOwn + awayTeamGoals,
      totalVictories: homeTeamGoals > awayTeamGoals ? totalVictories + 1 : totalVictories,
      totalLosses: homeTeamGoals < awayTeamGoals ? totalLosses + 1 : totalLosses,
      totalDraws: homeTeamGoals === awayTeamGoals ? totalDraws + 1 : totalDraws,
    }), {
      goalsFavor: 0,
      goalsOwn: 0,
      totalVictories: 0,
      totalLosses: 0,
      totalDraws: 0,
    });
}

function getAwayTeamStats(team: Team, matches: Match[]): StatsForAllMatches {
  return matches
    .filter((match) => match.awayTeam === team.id)
    .reduce((
      { goalsFavor, goalsOwn, totalDraws, totalLosses, totalVictories },
      { homeTeamGoals, awayTeamGoals },
    ) => ({
      goalsFavor: goalsFavor + awayTeamGoals,
      goalsOwn: goalsOwn + homeTeamGoals,
      totalVictories: awayTeamGoals > homeTeamGoals ? totalVictories + 1 : totalVictories,
      totalLosses: awayTeamGoals < homeTeamGoals ? totalLosses + 1 : totalLosses,
      totalDraws: awayTeamGoals === homeTeamGoals ? totalDraws + 1 : totalDraws,
    }), {
      goalsFavor: 0,
      goalsOwn: 0,
      totalVictories: 0,
      totalLosses: 0,
      totalDraws: 0,
    });
}

function getTeamStats(team: Team, matches: Match[]): StatsForAllMatches {
  const statsAsHomeTeam = getHomeTeamStats(team, matches);
  const statsAsAwayTeam = getAwayTeamStats(team, matches);
  return {
    goalsFavor: statsAsHomeTeam.goalsFavor + statsAsAwayTeam.goalsFavor,
    goalsOwn: statsAsHomeTeam.goalsOwn + statsAsAwayTeam.goalsOwn,
    totalVictories: statsAsHomeTeam.totalVictories + statsAsAwayTeam.totalVictories,
    totalLosses: statsAsHomeTeam.totalLosses + statsAsAwayTeam.totalLosses,
    totalDraws: statsAsHomeTeam.totalDraws + statsAsAwayTeam.totalDraws,
  };
}

function compareTeams(t1: OverallTeamStats, t2: OverallTeamStats) {
  const totalPointsDifference = t2.totalPoints - t1.totalPoints;
  if (totalPointsDifference !== 0) return totalPointsDifference;

  const totalVictoriesDifference = t2.totalVictories - t1.totalVictories;
  if (totalVictoriesDifference !== 0) return totalVictoriesDifference;

  const goalsBalanceDifference = t2.goalsBalance - t1.goalsBalance;
  if (goalsBalanceDifference !== 0) return goalsBalanceDifference;

  const goalsFavorDifference = t2.goalsFavor - t1.goalsFavor;
  if (goalsFavorDifference !== 0) return goalsFavorDifference;

  const goalsOwnDifference = t1.goalsOwn - t2.goalsOwn;
  if (goalsOwnDifference !== 0) return goalsOwnDifference;

  return 0;
}

function buildLeaderboard(
  teams: Team[],
  matches: Match[],
  getStats: GetStatsFunction,
): OverallTeamStats[] {
  return teams.map((team) => {
    const stats = getStats(team, matches);

    const totalGames = stats.totalDraws + stats.totalVictories + stats.totalLosses;
    const totalPoints = stats.totalVictories * 3 + stats.totalDraws;
    const efficiency = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

    return {
      ...stats,
      totalGames,
      totalPoints,
      efficiency,
      goalsBalance: stats.goalsFavor - stats.goalsOwn,
      name: team.teamName,
    };
  }).sort(compareTeams);
}

export default class LeaderboardService {
  private matchesRepository = Match;
  private teamsRepository = Team;

  async getLeaderboard() {
    const [teams, matches] = await Promise.all([
      this.teamsRepository.findAll(),
      this.matchesRepository.findAll({ where: { inProgress: false } }),
    ]);

    return buildLeaderboard(teams, matches, getTeamStats);
  }

  async getHomeTeamsLeaderboard() {
    const [teams, matches] = await Promise.all([
      this.teamsRepository.findAll(),
      this.matchesRepository.findAll({ where: { inProgress: false } }),
    ]);

    return buildLeaderboard(teams, matches, getHomeTeamStats);
  }

  async getAwayTeamsLeaderboard() {
    const [teams, matches] = await Promise.all([
      this.teamsRepository.findAll(),
      this.matchesRepository.findAll({ where: { inProgress: false } }),
    ]);

    return buildLeaderboard(teams, matches, getAwayTeamStats);
  }
}
