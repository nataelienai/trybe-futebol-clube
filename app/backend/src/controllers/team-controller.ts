import { Request, Response } from 'express';
import TeamService from '../services/team-service';

export default class TeamController {
  private service = new TeamService();

  async findAll(req: Request, res: Response) {
    const teams = await this.service.findAll();
    res.status(200).json(teams);
  }
}
