import * as express from 'express';
import UserController from './controllers/user-controller';

class App {
  public app: express.Express = express();
  private userController = new UserController();

  constructor() {
    this.config();
    this.setupRoutes();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.post('/login', (req, res) => this.userController.login(req, res));
    this.app.get('/login/validate', (req, res) => this.userController.validateLogin(req, res));
  }

  public start(port: string | number): void {
    this.app.listen(port, () => console.log(`Server running on port ${port}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
