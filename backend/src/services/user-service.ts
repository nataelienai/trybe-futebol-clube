import * as bcrypt from 'bcryptjs';

import User from '../database/models/user';
import Token from '../util/token';
import UnauthorizedError from '../errors/unauthorized';
import BadRequestError from '../errors/bad-request';

export default class UserService {
  private usersRepository = User;

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestError('All fields must be filled');
    }

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const responseUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    const token = Token.create(responseUser);

    return { user: responseUser, token };
  }

  async validateLogin(token: string) {
    const { id } = Token.verify(token);
    const { role } = await this.usersRepository.findByPk(
      id,
      { attributes: ['role'] },
    ) as User;

    return role;
  }
}
