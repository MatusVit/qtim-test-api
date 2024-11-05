## Description

[Test Task](https://github.com/MatusVit/qtim-test-api) for Middle NestJS Developer
(https://github.com/MatusVit/qtim-test-api)

Performer: MatVi

Task: https://wild-bean-19b.notion.site/Middle-NestJS-824b413a224f490cb75bd6329888f99c

## Project setup

```bash
$ npm install
```

## Copy .env.example

Copy .env.example to .env

```
$ cp .env.example .env
```

## Run DBs in docker containers

PostgresSQL and Redis.

_Docker must be installed and running on your system._

```bash
$ npm up:db:docker
```

Down DB containers

```bash
$ npm down:db:docker
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

url: **{domain}/api**

_example: http://localhost:3000/api_

## Swagger documents

url: **{domain}/doc**

_example: http://localhost:3000/doc_

## Run tests

```bash
# unit tests
$ npm run test
```
