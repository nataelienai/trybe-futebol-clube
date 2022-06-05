import { Router } from 'express';
import LeaderboardController from './controllers/leaderboard-controller';
import MatchController from './controllers/match-controller';
import TeamController from './controllers/team-controller';
import UserController from './controllers/user-controller';

const router = Router();

const userController = new UserController();
const teamController = new TeamController();
const matchController = new MatchController();
const leaderboardController = new LeaderboardController();

router.post('/login', (req, res) => userController.login(req, res));
router.get('/login/validate', (req, res) => userController.validateLogin(req, res));

router.get('/teams/:id', (req, res) => teamController.findById(req, res));
router.get('/teams', (req, res) => teamController.findAll(req, res));

router.get('/matches', (req, res) => matchController.findAll(req, res));
router.post('/matches', (req, res) => matchController.create(req, res));
router.patch('/matches/:id', (req, res) => matchController.update(req, res));
router.patch('/matches/:id/finish', (req, res) => matchController.setAsFinished(req, res));

router.get('/leaderboard/home', (req, res) => (
  leaderboardController.getHomeTeamsLeaderboard(req, res)
));
router.get('/leaderboard/away', (req, res) => (
  leaderboardController.getAwayTeamsLeaderboard(req, res)
));

export default router;
