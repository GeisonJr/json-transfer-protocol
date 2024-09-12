import * as envfy from '@geisonjr/envfy'
import * as net from 'node:net'
import * as tls from 'node:tls'
import { Status } from '../const'
import { Events } from '../event'
import { Log } from '../log'
import type { TRequest } from '../request/types'
import type { TResponse } from '../response/types'
import { uuid } from '../util/uuid'
import type { ClientEvents, ClientOptions, Error, SocketClient, Success } from './types'

/**
 * Class to create a Client
 */
export class Client<T extends ClientEvents> extends Events<T> {
	protected readonly id: string
	protected readonly log: Log
	public socket!: SocketClient

	constructor(protected options = {} as ClientOptions) {
		super()
		this.id = uuid()
		this.log = new Log(this.id)

		this.setupDefaultOptions()
		this.setupClient()
		this.setupEvents()
	}

	private setupDefaultOptions(): void {
		const { options } = this
		options.secure ??= envfy.boolean('CLIENT_SECURE', true)
		options.host ??= envfy.string('CLIENT_HOST', '127.0.0.1')
		options.port ??= envfy.number('CLIENT_PORT', 6969) // 9669
	}

	private setupClient(): void {
		if (this.options.secure) {
			this.socket = tls.connect({
				host: this.options.host,
				port: this.options.port
			})
			return
		}

		this.socket = net.connect({
			host: this.options.host,
			port: this.options.port
		})
	}

	private setupEvents(): void {
		this.socket.on('connect', this.onConnection.bind(this))
		this.socket.on('data', this.onData.bind(this))
		this.socket.on('end', this.onEnd.bind(this))
		this.socket.on('secureConnect', this.onSecureConnection.bind(this))
	}

	/* Client Events */
	protected onConnection(): void {
		if (!this.options.secure)
			this.onConnect()
	}

	protected onSecureConnection(): void {
		if (this.options.secure)
			this.onConnect()
	}

	protected onConnect(): void {
		// @ts-ignore
		this.socket.raw = Buffer.alloc(0)
	}

	protected onData(data: Buffer): void {
		// @ts-ignore
		this.socket.raw = Buffer.concat([this.socket.raw, data])
	}

	protected onEnd(): void {
		// @ts-ignore
		const raw = this.socket.raw.toString()

		const data = JSON.parse(raw.toString()) as TResponse
		this.emit('receive', data)
	}

	/* Client */
	public stop(): void {
		this.socket.destroy()
	}

	public async send(data: TRequest): Promise<void> {
		const buffer = Buffer.from(JSON.stringify(data))
		this.socket.write(buffer)
		this.socket.end()
	}
}

/**
 * Create a new Client
 */
export function createClient(options?: ClientOptions) {
	return new Client<ClientEvents>(options)
}

/**
 * Fetch data from a server
 */
export function fetcher<T>(data: TRequest, options?: ClientOptions) {
	return new Promise<Success<T> | Error>((resolve) => {

		const client = new Client<ClientEvents>(options)

		client.socket.on('error', () => {
			resolve({
				success: false,
				data: Status.INTERNAL_CLIENT_ERROR
			})
		})

		client.socket.on('ready', () => {
			client.send(data)
		})

		client.on('receive', (data) => {
			resolve({
				success: true,
				data: data as T
			})
		})
	})
}
