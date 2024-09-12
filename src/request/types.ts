import { Method } from '../const'

interface Body {
	/**
	 * Data type of the body
	 * @example 'array'
	 * @example 'boolean'
	 * @example 'null'
	 * @example 'number'
	 * @example 'object'
	 * @example 'string'
	 */
	type: 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string'
	/**
	 * The data of the body
	 * @example [1, 2, 3]
	 * @example true
	 * @example null
	 * @example 42
	 * @example { hello: 'world' }
	 * @example 'Hello, World!' or '2021-01-01T00:00:00.000Z'
	 */
	data: any
}

interface Head {
	[key: string]: string
	/**
	 * The domain name or IP address of the target server.
	 * @example 'example.com'
	 */
	host: string
	/**
	 * The path of the request.
	 * @example '/api/v1/users'
	 */
	path: string
	/**
	 * Method of the request.
	 * @example 'CREATE', 'READ', 'UPDATE', 'DELETE'
	 */
	method: Method
}

export interface TRequest {
	body: Body
	head: Head
}
