import { Request, Response } from 'express';
import UserService from '../services/user-service';

export default class UserController {
  private service = new UserService();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const data = await this.service.login(email, password);
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      }
    }
  }
}
