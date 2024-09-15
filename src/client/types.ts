import * as net from 'node:net'
import * as tls from 'node:tls'
import type { Body, Head, TResponse } from '../response/types'
import type { TStatus } from '../types'

export interface ClientEvents {
	close: boolean
	ready: undefined
	receive: TResponse
}

export interface ClientOptions {
	/**
	 * The host to connect to
	 * @example '127.0.0.1'
	 */
	host?: string
	/**
	 * The port to connect to
	 * @example 6969
	 */
	port?: number
	/**
	 * Whether to use TLS
	 * @default true
	 */
	secure?: boolean
}

export type SocketClient = net.Socket | tls.TLSSocket

export interface Error<T = any> {
	success: false
	body: Body<T>
	head: Head
	status: TStatus
}

export interface Success<T = any> {
	success: true
	body: Body<T>
	head: Head
	status: TStatus
}
