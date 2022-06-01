import * as bcrypt from 'bcryptjs';

import User from '../database/models/user';
import Token from '../util/token';

export default class UserService {
  private usersRepository = User;

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new Error('User not found.');

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Incorrect password.');
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
}
