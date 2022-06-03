import 'mocha';

import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/match';
import Team from '../database/models/team';

chai.use(chaiHttp);

const { expect } = chai;

describe('[GET] /matches', () => {
  it('should return all matches', async () => {
    const matchesMock = [
      {
        id: 1,
        homeTeam: 16,
        homeTeamGoals: 1,
        awayTeam: 8,
        awayTeamGoals: 1,
        inProgress: false,
        teamHome: {
          teamName: 'São Paulo'
        },
        teamAway: {
          teamName: 'Grêmio'
        }
      },
      {
        id: 2,
        homeTeam: 16,
        homeTeamGoals: 2,
        awayTeam: 9,
        awayTeamGoals: 0,
        inProgress: true,
        teamHome: {
          teamName: 'São Paulo'
        },
        teamAway: {
          teamName: 'Internacional'
        }
      }
    ];
    sinon.stub(Match, 'findAll').resolves(matchesMock as Match[]);

    const { status, body: matches } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(matches).to.deep.equal(matchesMock);
    expect((Match.findAll as sinon.SinonStub).calledWith({
      include: {
        all: true,
        attributes: { exclude: ['id'] },
      },
    })).to.be.true;

    (Match.findAll as sinon.SinonStub).restore();
  });
});
