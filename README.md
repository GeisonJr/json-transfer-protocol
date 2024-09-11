<h1 align="center">
  JTP (JSON Transfer Protocol) Library
</h1>
<div align="center">

Easy to use, fast and lightweight library for Node.js.

</div>

<div align="center">

[![LICENSE](https://img.shields.io/github/license/geisonjr/json-transfer-protocol?style=flat)](https://github.com/GeisonJr/json-transfer-protocol/blob/main/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@geisonjr/json-transfer-protocol?style=flat)](https://npmjs.com/package/@geisonjr/json-transfer-protocol)
[![NPM downloads](https://img.shields.io/npm/dt/@geisonjr/json-transfer-protocol?style=flat)](https://npmjs.com/package/@geisonjr/json-transfer-protocol)

</div>

> :construction: This project is under development and is not yet ready for use.

## :link: Table of Contents

- :bulb: [About](#bulb-about)
- :rocket: [Tecnologies](#rocket-tecnologies)
- :construction_worker: [How to run](#construction_worker-how-to-run)
- :book: [Documentation](#book-documentation)
- :handshake: [How to Contribute](#handshake-how-to-contribute)
- :memo: [License](#memo-license)

## :bulb: About

JTP is a protocol for transferring data between systems. It facilitates communication between systems using JSON (JavaScript Object Notation) as the data format and relies on the TCP/IP protocol for data transfer.

### JTP Request Example

```jsonc
{
  "head": {
    "host": "example.com:6969",
    "method": "CREATE",
    "path": "/api/v1"
  },
  "body": {
    "type": "string",
    "data": "Hello World!!"
  }
}
```

## :rocket: Tecnologies

The following tools were used in the construction of the project:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

## :construction_worker: How to run

### Installation

```bash
npm install @geisonjr/json-transfer-protocol
```

or using yarn

```bash
yarn add @geisonjr/json-transfer-protocol
```

## :book: Documentation

### Create a server

```typescript
import { Server, Status } from '@geisonjr/json-transfer-protocol';

const server = new Server({
  port: 6969
});

server.start();

server.create('/api/test', (req, res) => {

  const name = req.body.data.name;

  res.status = Status.OK;
  res.body = {
    type: 'string',
    data: `Hello, ${name}`
  };
});
```

### Create a request

```typescript
import { fetcher } from '@geisonjr/json-transfer-protocol';

const response = await fetcher({
  head: {
    host: 'example.com',
    method: 'CREATE',
    path: '/api/test'
  },
  body: {
    type: 'object',
    data: {
      name: 'Geison',
      age: 23
    }
  }
});

if (!response.success) {
  console.error(response.data);
  return;
}

console.log(response.data);
```

## :handshake: How to Contribute

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## :memo: License

This project is under the
[MIT License](https://github.com/GeisonJr/json-transfer-protocol/blob/main/LICENSE).
