import { Request, Response } from 'express';

import BaseError from '../errors/base-error';
import UserService from '../services/user-service';

export default class UserController {
  private service = new UserService();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const data = await this.service.login(email, password);
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof BaseError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async validateLogin(req: Request, res: Response) {
    const token = req.headers.authorization;
    const role = await this.service.validateLogin(token as string);
    res.status(200).json(role);
  }
}
