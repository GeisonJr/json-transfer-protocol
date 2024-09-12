import * as envfy from '@geisonjr/envfy'
import { isNull } from '@geisonjr/typefy'
import * as fs from 'node:fs'
import * as net from 'node:net'
import * as tls from 'node:tls'
import type { SocketClient } from '../client/types'
import { Method, Status } from '../const'
import { Events } from '../event'
import { Log } from '../log'
import { Request } from '../request'
import { Response } from '../response'
import { Router } from '../router'
import type { Handler } from '../router/types'
import { uuid } from '../util/uuid'
import type { ServerEvents, ServerOptions, SocketServer } from './types'

/**
 * Class to create a Server
 */
export class Server<T extends ServerEvents> extends Events<T> {
  public readonly id: string
  public readonly log: Log
  public readonly router: Router
  public socket!: SocketServer

  constructor(protected options = {} as ServerOptions) {
    super()
    this.id = uuid()
    this.log = new Log(this.id)
    this.router = new Router()

    this.setupDefaultOptions()
    this.setupServer()
    this.setupEvents()
  }

  private setupDefaultOptions(): void {
    const { options } = this
    options.secure ??= envfy.boolean('SERVER_SECURE', true)
    options.host ??= envfy.string('SERVER_HOST', '127.0.0.1')
    options.port ??= envfy.number('SERVER_PORT', 6969) // 9669
    options.cert ??= envfy.string('SERVER_CERT')
    options.key ??= envfy.string('SERVER_KEY')
    options.ca ??= envfy.string('SERVER_CA')
  }

  private setupServer(): void {
    const { options } = this

    if (options.secure) {
      let cert: undefined | string
      if (!!options.cert)
        cert = fs.readFileSync(options.cert, {
          encoding: 'utf8'
        })

      let key: undefined | string
      if (!!options.key)
        key = fs.readFileSync(options.key, {
          encoding: 'utf8'
        })

      let ca: undefined | string
      if (!!options.ca)
        ca = fs.readFileSync(options.ca, {
          encoding: 'utf8'
        })

      if (options.secure)
        if (!cert)
          throw new Error('Missing certificate file')
        else if (!key)
          throw new Error('Missing key file')

      this.socket = tls.createServer({
        rejectUnauthorized: false,
        requestCert: false,
        cert,
        key,
        ca
      })
      return
    }

    this.socket = net.createServer()
  }

  private setupEvents(): void {
    this.socket.on('connection', this.onConnection.bind(this))
    this.socket.on('secureConnection', this.onSecureConnection.bind(this))
  }

  protected onConnection(client: SocketClient): void {
    if (!this.options.secure)
      this.onConnect(client)
  }

  protected onSecureConnection(client: SocketClient) {
    if (this.options.secure)
      this.onConnect(client)
  }

  /* Client Events */
  protected onConnect(client: SocketClient): void {
    // @ts-ignore
    client.raw = Buffer.alloc(0)

    // Register events
    client.on('data', this.onData.bind(this, client))
    client.on('end', this.onEnd.bind(this, client))
  }

  protected onData(client: SocketClient, raw: Buffer): void {
    // @ts-ignore
    client.raw = Buffer.concat([client.raw, raw])
  }

  protected onEnd(client: SocketClient): void {
    const response = new Response()
    response.host = this.options.host

    // @ts-ignore
    const raw = client.raw.toString()

    try {
      if (!raw.length) {
        response.status = Status.BAD_REQUEST
        return
      }

      const request = new Request(raw)

      const route = this.router.find(request.head.method, request.head.path)

      if (isNull(route)) {
        response.status = Status.NOT_FOUND
        return
      }

      const { handler, middlewares } = route

      for (const middleware of middlewares)
        middleware(request, response)

      handler(request, response)

    } catch (_error) {
      response.status = Status.INTERNAL_SERVER_ERROR

    } finally {
      client.write(response.toString())
      client.end()
    }
  }

  /* Router */
  public create(pathname: string, handler: Handler, ...middlewares: Handler[]): void {
    this.router.add(Method.CREATE, pathname, handler, ...middlewares)
  }

  public read(pathname: string, handler: Handler, ...middlewares: Handler[]): void {
    this.router.add(Method.READ, pathname, handler, ...middlewares)
  }

  public update(pathname: string, handler: Handler, ...middlewares: Handler[]): void {
    this.router.add(Method.UPDATE, pathname, handler, ...middlewares)
  }

  public delete(pathname: string, handler: Handler, ...middlewares: Handler[]): void {
    this.router.add(Method.DELETE, pathname, handler, ...middlewares)
  }

  /* Server */
  public start(): void {
    this.socket.listen({
      host: this.options.host,
      port: this.options.port
    })
  }

  public stop(): void {
    this.socket.close()
  }
}

/**
 * Create a new Server
 */
export function createServer(options?: ServerOptions) {
  return new Server<ServerEvents>(options)
}
