import type { TStatus } from '../types'

export interface Body<T = any> {
	/**
	 * Data type of the body
	 * @default 'null'
	 * @example 'array'
	 * @example 'boolean'
	 * @example 'null'
	 * @example 'number'
	 * @example 'object'
	 * @example 'string'
	 */
	type:
	T extends null
	? 'null'
	: T extends boolean
	? 'boolean'
	: T extends number
	? 'number'
	: T extends string
	? 'string'
	: T extends Array<any>
	? 'array'
	: T extends object
	? 'object'
	: 'null'
	/**
	 * The data of the body
	 * @default null
	 * @example [1, 2, 3]
	 * @example true
	 * @example null
	 * @example 42
	 * @example { hello: 'world' }
	 * @example 'Hello, World!' or '2021-01-01T00:00:00.000Z'
	 */
	data: T
}

export interface Head {
	[key: string]: string
	/**
	 * The domain name or IP address of the server.
	 * @default ''
	 * @example 'example.com'
	 */
	host: string
}

export interface TResponse {
	body: Body
	head: Head
	status: TStatus
}
