import { Request, Response } from 'express';
import TeamService from '../services/team-service';

export default class TeamController {
  private service = new TeamService();

  async findAll(_req: Request, res: Response) {
    const teams = await this.service.findAll();
    res.status(200).json(teams);
  }

  async findById(req: Request, res: Response) {
    const id = Number(req.params.id);
    console.log(id);
    const team = await this.service.findById(id);
    res.status(200).json(team);
  }
}
