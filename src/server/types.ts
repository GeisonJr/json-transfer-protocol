import * as net from 'node:net'
import * as tls from 'node:tls'

export interface ServerEvents {
	// ...
}

export interface ServerOptions {
	/**
	 * The host to bind the server to
	 * @example '127.0.0.1'
	 */
	host?: string
	/**
	 * The port to bind the server to
	 * @example 8080
	 */
	port?: number
	/**
	 * Whether to use TLS
	 * @default true
	 */
	secure?: boolean
	/**
	 * Path to the certificate file
	 * @example '/path/to/cert.pem'
	 */
	cert?: string
	/**
	 * Path to the key file
	 * @example '/path/to/key.pem'
	 */
	key?: string
	/**
	 * Path to the CA file
	 * @example '/path/to/ca.pem'
	 */
	ca?: string
}

export type SocketServer = net.Server | tls.Server
