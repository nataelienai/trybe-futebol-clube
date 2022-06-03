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
  it('should return all matches when no filter is applied', async () => {
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
      }
    })).to.be.true;

    (Match.findAll as sinon.SinonStub).restore();
  });

  it('should return only matches in progress when inProgress is true', async () => {
    const matchesMock = [
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
      },
      {
        id: 3,
        homeTeam: 9,
        homeTeamGoals: 0,
        awayTeam: 8,
        awayTeamGoals: 3,
        inProgress: true,
        teamHome: {
          teamName: 'Internacional'
        },
        teamAway: {
          teamName: 'Grêmio'
        }
      },
    ];
    sinon.stub(Match, 'findAll').resolves(matchesMock as Match[]);

    const {
      status,
      body: matches
    } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.equal(200);
    expect(matches).to.deep.equal(matchesMock);
    expect((Match.findAll as sinon.SinonStub).calledWith({
      include: {
        all: true,
        attributes: { exclude: ['id'] },
      },
      where: {
        inProgress: true,
      },
    })).to.be.true;

    (Match.findAll as sinon.SinonStub).restore();
  });

  it('should return only finished matches when inProgress is false', async () => {
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
        id: 4,
        homeTeam: 5,
        homeTeamGoals: 1,
        awayTeam: 10,
        awayTeamGoals: 2,
        inProgress: false,
        teamHome: {
          teamName: 'Santos'
        },
        teamAway: {
          teamName: 'Palmeiras'
        }
      },
    ];
    sinon.stub(Match, 'findAll').resolves(matchesMock as Match[]);

    const {
      status,
      body: matches
    } = await chai.request(app).get('/matches?inProgress=false');

    expect(status).to.equal(200);
    expect(matches).to.deep.equal(matchesMock);
    expect((Match.findAll as sinon.SinonStub).calledWith({
      include: {
        all: true,
        attributes: { exclude: ['id'] },
      },
      where: {
        inProgress: false,
      },
    })).to.be.true;

    (Match.findAll as sinon.SinonStub).restore();
  });
});
