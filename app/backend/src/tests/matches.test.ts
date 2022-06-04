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

describe('[POST] /matches', () => {
  it('should create a match', async () => {
    const teamsMock = [
      {
        id: 1,
        teamName: 'Santos',
      },
      {
        id: 2,
        teamName: 'São Paulo',
      }
    ];
    const match = {
      homeTeam: teamsMock[0].id,
      awayTeam: teamsMock[1].id,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true
    };
    const createdMatchMock = { id: 1, ...match };

    sinon.stub(Team, 'findByPk')
      .withArgs(teamsMock[0].id).resolves(teamsMock[0] as Team)
      .withArgs(teamsMock[1].id).resolves(teamsMock[1] as Team);

    sinon.stub(Match, 'create').resolves(createdMatchMock as Match);

    const { status, body: createdMatch } = await chai.request(app)
      .post('/matches')
      .send(match);
    
    expect(status).to.equal(201);
    expect(createdMatch).to.deep.equal(createdMatchMock);
    expect((Match.create as sinon.SinonStub).calledWith(match)).to.be.true;

    (Match.create as sinon.SinonStub).restore();
    (Team.findByPk as sinon.SinonStub).restore();
  });

  it('should return error if both teams in the match are equal', async () => {
    const { status, body: { message } } = await chai.request(app)
      .post('/matches')
      .send({
        homeTeam: 8,
        awayTeam: 8,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
        inProgress: true
      });

    expect(status).to.equal(401);
    expect(message).to.equal('It is not possible to create a match with two equal teams');
  });

  it('should return error if at least one of the teams does not exist', async () => {
    sinon.stub(Team, 'findByPk').resolves(null);

    const { status, body: { message } } = await chai.request(app)
      .post('/matches')
      .send({
        homeTeam: 8,
        awayTeam: 9,
        homeTeamGoals: 2,
        awayTeamGoals: 2,
        inProgress: true
      });

    expect(status).to.equal(404);
    expect(message).to.equal('There is no team with such id!');

    (Team.findByPk as sinon.SinonStub).restore();
  });
});

describe('[PATCH] /matches/:id/finish', () => {
  it('should set the match specified by id to finished', async () => {
    sinon.stub(Match, 'update').resolves();

    const matchId = 1;
    const { status, body: { message } } = await chai.request(app)
      .patch(`/matches/${matchId}/finish`);
    
    expect(status).to.equal(200);
    expect(message).to.equal('Finished');
    expect((Match.update as sinon.SinonStub).calledWith(
      { inProgress: false },
      { where: { id: matchId } }
    )).to.be.true;

    (Match.update as sinon.SinonStub).restore();
  });
});
