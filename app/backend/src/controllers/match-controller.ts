import { Request, Response } from 'express';
import BaseError from '../errors/base-error';
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
    try {
      const match = await this.service.create(req.body);
      res.status(201).json(match);
    } catch (err) {
      if (err instanceof BaseError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async setAsFinished(req: Request, res: Response) {
    await this.service.setAsFinished(Number(req.params.id));
    res.status(200).json({ message: 'Finished' });
  }

  async update(req: Request, res: Response) {
    await this.service.update(Number(req.params.id), req.body);
    res.status(200).json({ message: 'Updated' });
  }
}
