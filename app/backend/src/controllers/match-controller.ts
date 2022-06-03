import { Request, Response } from 'express';
import MatchService from '../services/match-service';

export default class MatchController {
  private service = new MatchService();

  async findAll(req: Request, res: Response) {
    let matches;
    if (req.query.inProgress) {
      const inProgress = req.query.inProgress === 'true';
      matches = await this.service.findAll({ inProgress });
    } else {
      matches = await this.service.findAll();
    }
    res.status(200).json(matches);
  }

  async create(req: Request, res: Response) {
    const match = await this.service.create(req.body);
    res.status(201).json(match);
  }
}
