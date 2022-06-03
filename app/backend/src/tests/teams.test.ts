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

    const { status, body: teams } = await chai.request(app).get('/teams');

    expect(teams).to.deep.equal(teamsMock);
    expect(status).to.equal(200);

    (Team.findAll as sinon.SinonStub).restore();
  });
});

describe('[GET] /teams/:id', () => {
  it('should return the team with the specified id', async () => {
    const teamMock = {
      id: 1,
      teamName: 'Avaí/Kindermann'
    };
    sinon.stub(Team, 'findByPk').resolves(teamMock as Team);

    const { status, body: team } = await chai.request(app).get(`/teams/${teamMock.id}`);

    expect(team).to.deep.equal(teamMock);
    expect(status).to.equal(200);
    expect((Team.findByPk as sinon.SinonStub).calledWith(teamMock.id)).to.be.true;

    (Team.findByPk as sinon.SinonStub).restore();
  });
});
