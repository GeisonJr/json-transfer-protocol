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

### Configure the `env` file for the client

```.env
# Host address of the client
CLIENT_HOST=127.0.0.1
# Port the client will use
CLIENT_PORT=6969
# Indicates if the client uses a secure connection
CLIENT_SECURE=true
```

### Configure the `env` file for the server

```.env
# Host address of the server
SERVER_HOST=127.0.0.1
# Port the server will use
SERVER_PORT=6969
# Indicates if the server uses SSL for secure connections
SERVER_SECURE=true
# Path to the server SSL certificate
SERVER_CERT=/certs/cert.pem
# Path to the server SSL key
SERVER_KEY=/certs/key.pem
# Path to the Certificate Authority (CA) certificate
SERVER_CA=/certs/ca.pem
```

### Configure the `env` file for the logger

```.env
# Directory where logs will be stored
LOG_DIR=./logs
# Enables or disables logging
LOG=false
# Maximum size of the log file
LOG_MAX=1000000
# Defines if logs will be displayed in the console
LOG_CONSOLE=true
# Defines if logs will be formatted as JSON
LOG_JSON=false
# Defines if logs will be formatted as text
LOG_LOG=false
# Enables or disables DEBUG log level
LOG_DEBUG=true
# Enables or disables INFO log level
LOG_INFO=true
# Enables or disables WARN log level
LOG_WARN=true
# Enables or disables ERROR log level
LOG_ERROR=true
# Enables or disables FATAL log level
LOG_FATAL=true
# Enables or disables TRACE log level
LOG_TRACE=true
```

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
