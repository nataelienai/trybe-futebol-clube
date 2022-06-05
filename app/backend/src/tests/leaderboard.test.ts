import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/team';
import Match from '../database/models/match';

chai.use(chaiHttp);

const { expect } = chai;

describe('[GET] /leaderboard/home', () => {
  it('should get the leaderboard for the teams when they played at home', async () => {
    const teamsMock = [
      {
        id: 1,
        teamName: 'Palmeiras',
      },
      {
        id: 2,
        teamName: 'Corinthians',
      },
      {
        id: 3,
        teamName: 'Santos',
      },
    ];
    const matchesMock = [
      {
        id: 1,
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 2,
        awayTeamGoals: 1,
        inProgress: false,
      },
      {
        id: 2,
        homeTeam: 2,
        homeTeamGoals: 0,
        awayTeam: 1,
        awayTeamGoals: 2,
        inProgress: false,
      },
      {
        id: 3,
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 3,
        awayTeamGoals: 2,
        inProgress: false,
      },
      {
        id: 4,
        homeTeam: 3,
        homeTeamGoals: 0,
        awayTeam: 1,
        awayTeamGoals: 0,
        inProgress: false,
      },
      {
        id: 5,
        homeTeam: 2,
        homeTeamGoals: 2,
        awayTeam: 3,
        awayTeamGoals: 2,
        inProgress: false,
      },
      {
        id: 6,
        homeTeam: 3,
        homeTeamGoals: 2,
        awayTeam: 2,
        awayTeamGoals: 0,
        inProgress: false,
      },
    ];
    const expectedLeaderboard = [
      {
        name: 'Santos',
        totalPoints: 4,
        totalGames: 2,
        totalVictories: 1,
        totalDraws: 1,
        totalLosses: 0,
        goalsFavor: 2,
        goalsOwn: 0,
        goalsBalance: 2,
        efficiency: 66.67
      },
      {
        name: 'Palmeiras',
        totalPoints: 1,
        totalGames: 2,
        totalVictories: 0,
        totalDraws: 1,
        totalLosses: 1,
        goalsFavor: 2,
        goalsOwn: 3,
        goalsBalance: -1,
        efficiency: 16.67
      },
      {
        name: 'Corinthians',
        totalPoints: 1,
        totalGames: 2,
        totalVictories: 0,
        totalDraws: 1,
        totalLosses: 1,
        goalsFavor: 2,
        goalsOwn: 4,
        goalsBalance: -2,
        efficiency: 16.67
      },
    ];

    sinon.stub(Team, 'findAll').resolves(teamsMock as Team[]);
    sinon.stub(Match, 'findAll').resolves(matchesMock as Match[]);

    const { status, body: receivedLeaderboard } = await chai
      .request(app)
      .get('/leaderboard/home');

    expect(status).to.equal(200);
    expect(receivedLeaderboard).to.deep.equal(expectedLeaderboard);
    expect((Match.findAll as sinon.SinonStub).calledWith({
      where: { inProgress: false }
    })).to.be.true;

    (Team.findAll as sinon.SinonStub).restore();
    (Match.findAll as sinon.SinonStub).restore();
  });
});
