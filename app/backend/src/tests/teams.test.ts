import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/team';

chai.use(chaiHttp);

const { expect } = chai;

describe('[GET] /teams', () => {
  it('should return all teams', async () => {
    const teamsMock = [
      {
        id: 1,
        teamName: 'Avaí/Kindermann'
      },
      {
        id: 2,
        teamName: 'Bahia'
      },
      {
        id: 3,
        teamName: 'Botafogo'
      }
    ];
    sinon.stub(Team, 'findAll').resolves(teamsMock as Team[]);

    const { body: teams } = await chai.request(app).get('/teams');

    expect(teams).to.deep.equal(teamsMock);

    (Team.findAll as sinon.SinonStub).restore();
  });
});
