import * as jwt from 'jsonwebtoken';
import jwtSecret from './jwtSecret';

interface UserPublicProps {
  id: number,
  username: string,
  role: string,
  email: string,
}

export default class Token {
  static create(props: UserPublicProps): string {
    return jwt.sign(props, jwtSecret, { algorithm: 'HS256', expiresIn: '1h' });
  }

  static verify(token: string): UserPublicProps {
    return jwt.verify(token, jwtSecret) as UserPublicProps;
  }
}
