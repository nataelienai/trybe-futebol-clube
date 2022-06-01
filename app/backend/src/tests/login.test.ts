import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import User from '../database/models/user';
import jwtSecret from '../util/jwtSecret';

chai.use(chaiHttp);

const { expect } = chai;

describe('[POST] /login', () => {
  before(async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: '123456'
    } as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  });

  it('should return the user details and a token', async () => {
    const { body: { user, token } } = await chai.request(app)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' });

    expect(user?.id).to.equal(1);
    expect(user?.username).to.equal('Admin');
    expect(user?.role).to.equal('admin');
    expect(user?.email).to.equal('admin@email.com');
    expect(user?.password).to.be.undefined;
    expect(!!jwt.verify(token, jwtSecret)).to.be.true;
  });
});
