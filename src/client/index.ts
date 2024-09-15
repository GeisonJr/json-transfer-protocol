import * as envfy from '@geisonjr/envfy'
import { isUndefined } from '@geisonjr/typefy'
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
	public readonly id: string
	public readonly log: Log
	public options!: Required<ClientOptions>
	public socket!: SocketClient

	constructor(options: ClientOptions = {}) {
		super()
		this.id = uuid()
		this.log = new Log(this.id)

		this.setupDefaultOptions(options)
		this.setupClient()
		this.setupEvents()
	}

	private setupDefaultOptions(options: ClientOptions): void {
		this.options = {
			secure: options.secure ?? envfy.boolean('CLIENT_SECURE', true),
			host: options.host ?? envfy.string('CLIENT_HOST', '127.0.0.1'),
			port: options.port ?? envfy.number('CLIENT_PORT', 6969) // 9669
		}
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
export function fetcher<S = any>(data: TRequest, options?: ClientOptions) {
	return new Promise<Success<S> | Error<string>>((resolve) => {

		const client = new Client<ClientEvents>(options)

		client.socket.on('error', (err) => {
			// @ts-ignore
			if (!isUndefined(err.code)) {
				resolve({
					success: false,
					status: {
						...Status.INTERNAL_CLIENT_ERROR,
						// @ts-ignore
						code: err.code,
						message: err.message
					},
					head: {
						host: options?.host ?? ''
					},
					body: {
						type: 'string',
						data: 'Failed to fetch'
					}
				})
				return
			}

			resolve({
				success: false,
				status: Status.INTERNAL_CLIENT_ERROR,
				head: {
					host: ''
				},
				body: {
					type: 'string',
					data: 'Failed to fetch'
				}
			})
		})

		client.socket.on('ready', () => {
			client.send(data)
		})

		client.on('receive', (data) => {
			if (data.status.code === Status.OK.code) {
				resolve({
					success: true,
					status: data.status,
					head: data.head,
					body: data.body
				})
				return
			}

			resolve({
				success: false,
				status: data.status,
				head: data.head,
				body: data.body
			})
		})
	})
}
