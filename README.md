# Trybe Futebol Clube

Trybe Futebol Clube é um website de partidas e classificações de futebol, onde é possível buscar, cadastrar e editar partidas e verificar as classificações geral, como mandante e como visitante de cada time.

Neste projeto, foi construído uma API com as regras de negócio da aplicação e que é consumida pelo Front-End provido pela [Trybe](https://www.betrybe.com/). Além disso, a aplicação está dockerizada e o código foi desenvolvido utilizando o método de Desenvolvimento Orientado a Testes, ou TDD (Test Driven Development).

## Tecnologias utilizadas

O Back-End foi desenvolvido em [Node.js](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/), utilizando o framework [Express](https://expressjs.com/), o banco de dados [MySQL](https://www.mysql.com/) e o Object-Relational Mapper (ORM) [Sequelize](https://sequelize.org/). Além disso, a autenticação do usuário é realizada através de [JSON Web Tokens (JWT)](https://jwt.io/), que são fornecidos ao realizar o login, e a senha do usuário é criptografada usando [bcrypt](https://en.wikipedia.org/wiki/Bcrypt).

Nos testes de integração, foram utilizados [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) e [Sinon](https://sinonjs.org/).

## Dependências

Você precisará das tecnologias de conteinerização [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados em sua máquina para executar a aplicação.

## Como executar a aplicação

Dentro da pasta do repositório, execute no terminal:

```sh
docker compose up
```

A primeira execução pode levar alguns minutos. Aguarde até que apareça a mensagem:

```
app_frontend  | Compiled successfully!
app_frontend  |
app_frontend  | You can now view tfc-frontend in the browser.
app_frontend  |
app_frontend  |   Local:            http://localhost:3000
...
```

Com isso, para abrir o aplicativo, acesse o endereço `http://localhost:3000` pelo seu navegador.

Para encerrar, pressione as teclas `ctrl + C` no terminal.

Acesse a [documentação da linha de comando do Docker Compose](https://docs.docker.com/engine/reference/commandline/compose/#child-commands) para saber mais sobre os comandos disponíveis.

## Como executar os testes

Com a aplicação em execução e em um novo terminal, execute:

```sh
docker compose exec backend npm test
```

Para verificar a cobertura de código, execute:

```sh
docker compose exec backend npm run test:coverage
```

---
