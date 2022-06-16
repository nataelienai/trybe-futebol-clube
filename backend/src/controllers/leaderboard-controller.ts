import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard-service';

export default class LeaderboardController {
  private service = new LeaderboardService();

  async getLeaderboard(req: Request, res: Response) {
    const leaderboard = await this.service.getLeaderboard();
    res.status(200).json(leaderboard);
  }

  async getHomeTeamsLeaderboard(req: Request, res: Response) {
    const leaderboard = await this.service.getHomeTeamsLeaderboard();
    res.status(200).json(leaderboard);
  }

  async getAwayTeamsLeaderboard(req: Request, res: Response) {
    const leaderboard = await this.service.getAwayTeamsLeaderboard();
    res.status(200).json(leaderboard);
  }
}
