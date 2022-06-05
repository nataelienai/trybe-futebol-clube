import * as express from 'express';
import routes from './routes';

class App {
  public app: express.Express = express();

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
    this.app.use(routes);
  }

  public start(port: string | number): void {
    this.app.listen(port, () => console.log(`Server running on port ${port}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
