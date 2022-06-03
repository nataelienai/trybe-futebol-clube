import { Request, Response } from 'express';
import MatchService from '../services/match-service';

export default class MatchController {
  private service = new MatchService();

  async findAll(_req: Request, res: Response) {
    const matches = await this.service.findAll();
    res.status(200).json(matches);
  }
}
