import { isArray, isBoolean, isBuffer, isNull, isNumber, isObject, isString } from '@geisonjr/typefy'
import type { TRequest } from './types'

/**
 * Class to create a Request
 */
export class Request {
	private readonly request: TRequest

	constructor(protected readonly raw: Buffer | object | string = '') {

		if (isBuffer(this.raw))
			this.request = JSON.parse(this.raw.toString()) as TRequest
		else if (isString(this.raw))
			this.request = JSON.parse(this.raw) as TRequest
		else if (isObject(this.raw))
			this.request = this.raw as TRequest
		else
			throw new Error('The raw request is not a valid data type')

		// Validate the request head
		if (!isString(this.request.head.host))
			throw new Error('The request host is not defined')
		else if (!isString(this.request.head.method))
			throw new Error('The request method is not defined')
		else if (!isString(this.request.head.path))
			throw new Error('The request path is not defined')

		// Validate the request body
		if (!isString(this.request.body.type))
			throw new Error('The request body type is not defined')
		// else if (!this._request.body.data)
		// 	throw new Error('The request body data is not defined')

		if (this.request.body.type === 'array' && !isArray(this.request.body.data))
			throw new Error('The request body data is not a valid array')
		else if (this.request.body.type === 'boolean' && !isBoolean(this.request.body.data))
			throw new Error('The request body data is not a valid boolean')
		else if (this.request.body.type === 'null' && !isNull(this.request.body.data))
			throw new Error('The request body data is not a valid null')
		else if (this.request.body.type === 'number' && !isNumber(this.request.body.data))
			throw new Error('The request body data is not a valid number')
		else if (this.request.body.type === 'object' && !isObject(this.request.body.data))
			throw new Error('The request body data is not a valid object')
		else if (this.request.body.type === 'string' && !isString(this.request.body.data))
			throw new Error('The request body data is not a valid string')
	}

	/**
	 * Get the request body
	 */
	public get body() {
		return this.request.body
	}

	/**
	 * Set the request body
	 */
	public set body(body: TRequest['body']) {
		this.request.body = {
			...this.request.body,
			...body,
		}
	}

	/**
	 * Get the request data
	 */
	public get data() {
		return this.request.body.data
	}

	/**
	 * Set the request data
	 */
	public set data(data: TRequest['body']['data']) {
		this.request.body.data = data
	}

	/**
	 * Get the request head
	 */
	public get head() {
		return this.request.head
	}

	/**
	 * Set the request head
	 */
	public set head(head: TRequest['head']) {
		this.request.head = {
			...this.request.head,
			...head,
		}
	}

	/**
	 * Get the request host
	 */
	public get host() {
		return this.request.head.host
	}

	/**
	 * Set the request host
	 */
	public set host(host: TRequest['head']['host']) {
		this.request.head.host = host
	}

	/**
	 * Get the request method
	 */
	public get method() {
		return this.request.head.method
	}

	/**
	 * Set the request method
	 */
	public set method(method: TRequest['head']['method']) {
		this.request.head.method = method
	}

	/**
	 * Get the request path
	 */
	public get path() {
		return this.request.head.path
	}

	/**
	 * Set the request path
	 */
	public set path(path: TRequest['head']['path']) {
		this.request.head.path = path
	}

	/**
	 * Get the request type
	 */
	public get type() {
		return this.request.body.type
	}

	/**
	 * Set the request type
	 */
	public set type(type: TRequest['body']['type']) {
		this.request.body.type = type
	}

	/**
	 * Convert the request to a string
	 */
	public toString(): string {
		return JSON.stringify(this.request)
	}
}
