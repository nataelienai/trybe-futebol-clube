import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import User from '../database/models/user';
import Token from '../util/token';

chai.use(chaiHttp);

const { expect } = chai;

describe('[POST] /login', () => {
  it('should return the user details and a token', async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: '123456'
    } as User);

    sinon.stub(bcrypt, 'compareSync').returns(true);

    const { body: { user, token } } = await chai.request(app)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' });

    expect(user?.id).to.equal(1);
    expect(user?.username).to.equal('Admin');
    expect(user?.role).to.equal('admin');
    expect(user?.email).to.equal('admin@email.com');
    expect(user?.password).to.be.undefined;
    expect(!!Token.verify(token)).to.be.true;

    (User.findOne as sinon.SinonStub).restore();
    (bcrypt.compareSync as sinon.SinonStub).restore();
  });

  it('should return error if email is invalid', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send({ email: 'user@email.com', password: '123456' });

    expect(status).to.equal(401);
    expect(message).to.equal('Incorrect email or password');

    (User.findOne as sinon.SinonStub).restore();
  });

  it('should return error if password is invalid', async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: '123456'
    } as User);

    sinon.stub(bcrypt, 'compareSync').returns(false);

    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send({ email: 'admin@email.com', password: '12345678' });

    expect(status).to.equal(401);
    expect(message).to.equal('Incorrect email or password');

    (User.findOne as sinon.SinonStub).restore();
    (bcrypt.compareSync as sinon.SinonStub).restore();
  });

  it('should return error if email is not provided', async () => {
    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send({ password: '123456' });

    expect(status).to.equal(400);
    expect(message).to.equal('All fields must be filled');
  });

  it('should return error if password is not provided', async () => {
    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send({ email: 'user@email.com' });

    expect(status).to.equal(400);
    expect(message).to.equal('All fields must be filled');
  });

  it('should return error if something unexpected occurred', async () => {
    sinon.stub(User, 'findOne').rejects(new Error('Unexpected error'));

    const { status } = await chai.request(app)
      .post('/login')
      .send({ email: 'admin@email.com', password: '123456' });

    expect(status).to.equal(500);

    (User.findOne as sinon.SinonStub).restore();
  });
});

describe('[GET] /login/validate', () => {
  it('should return the user role', async () => {
    const user = {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com'
    };
    const token = Token.create(user);
    sinon.stub(User, 'findOne').resolves(user as User);

    const { body: role } = await chai.request(app)
      .get('/login/validate')
      .set('Authorization', token);

    expect(role).to.equal(user.role);
    (User.findOne as sinon.SinonStub).restore();
  });
});
