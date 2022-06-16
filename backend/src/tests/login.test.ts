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
    const userMock = {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: '123456'
    };

    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);

    const { body: { user, token } } = await chai.request(app)
      .post('/login')
      .send({ email: userMock.email, password: userMock.password });

    expect(user?.id).to.equal(userMock.id);
    expect(user?.username).to.equal(userMock.username);
    expect(user?.role).to.equal(userMock.role);
    expect(user?.email).to.equal(userMock.email);
    expect(user?.password).to.be.undefined;
    expect(!!Token.verify(token)).to.be.true;
    expect(
      (User.findOne as sinon.SinonStub).calledWith({ where: { email: userMock.email }})
    ).to.be.true;
    expect(
      (bcrypt.compareSync as sinon.SinonStub).calledWith(userMock.password)
    ).to.be.true;

    (User.findOne as sinon.SinonStub).restore();
    (bcrypt.compareSync as sinon.SinonStub).restore();
  });

  it('should return error if email is invalid', async () => {
    const credentials = { email: 'user@email.com', password: '123456' };

    sinon.stub(User, 'findOne').resolves(null);

    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send(credentials);

    expect(status).to.equal(401);
    expect(message).to.equal('Incorrect email or password');
    expect(
      (User.findOne as sinon.SinonStub).calledWith({ where: { email: credentials.email }})
    ).to.be.true;

    (User.findOne as sinon.SinonStub).restore();
  });

  it('should return error if password is invalid', async () => {
    const userMock = {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@email.com',
      password: '123456'
    };

    sinon.stub(User, 'findOne').resolves(userMock as User);
    sinon.stub(bcrypt, 'compareSync').returns(false);

    const { status, body: { message } } = await chai.request(app)
      .post('/login')
      .send({ email: userMock.email, password: 'invalid_password' });

    expect(status).to.equal(401);
    expect(message).to.equal('Incorrect email or password');
    expect(
      (User.findOne as sinon.SinonStub).calledWith({ where: { email: userMock.email } })
    ).to.be.true;

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
    sinon.stub(User, 'findByPk').resolves(user as User);

    const { status, body: role } = await chai.request(app)
      .get('/login/validate')
      .set('Authorization', token);

    expect(status).to.equal(200);
    expect(role).to.equal(user.role);
    expect((User.findByPk as sinon.SinonStub).calledWith(user.id)).to.be.true;

    (User.findByPk as sinon.SinonStub).restore();
  });
});
