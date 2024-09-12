import { Status } from '../const'
import type { TResponse } from './types'

/**
 * Class to create a Response
 */
export class Response {
	private readonly response: TResponse

	constructor() {
		this.response = {
			status: Status.INTERNAL_SERVER_ERROR,
			head: {
				host: ''
			},
			body: {
				type: 'null',
				data: null
			}
		}
	}

	/**
	 * Get the response body
	 */
	public get body() {
		return this.response.body
	}

	/**
	 * Set the response body
	 */
	public set body(body: TResponse['body']) {
		this.response.body = {
			...this.response.body,
			...body,
		}
	}

	/**
	 * Get the response status code
	 */
	public get code() {
		return this.response.status.code
	}

	/**
	 * Set the response status code
	 */
	public set code(code: TResponse['status']['code']) {
		this.response.status.code = code
	}

	/**
	 * Get the response data
	 */
	public get data() {
		return this.response.body.data
	}

	/**
	 * Set the response data
	 */
	public set data(data: TResponse['body']['data']) {
		this.response.body.data = data
	}

	/**
	 * Get the response status description
	 */
	public get description() {
		return this.response.status.description
	}

	/**
	 * Set the response status description
	 */
	public set description(description: TResponse['status']['description']) {
		this.response.status.description = description
	}

	/**
	 * Get the response head
	 */
	public get head() {
		return this.response.head
	}

	/**
	 * Set the response head
	 */
	public set head(head: TResponse['head']) {
		this.response.head = {
			...this.response.head,
			...head,
		}
	}

	/**
	 * Get the response host
	 */
	public get host() {
		return this.response.head.host
	}

	/**
	 * Set the response host
	 */
	public set host(host: TResponse['head']['host']) {
		this.response.head.host = host
	}

	/**
	 * Get the response status
	 */
	public get status() {
		return this.response.status
	}

	/**
	 * Set the response status
	 */
	public set status(status: TResponse['status']) {
		this.response.status = status
	}

	/**
	 * Get the response status message
	 */
	public get message() {
		return this.response.status.message
	}

	/**
	 * Set the response status message
	 */
	public set message(message: TResponse['status']['message']) {
		this.response.status.message = message
	}

	/**
	 * Get the response type
	 */
	public get type() {
		return this.response.body.type
	}

	/**
	 * Set the response type
	 */
	public set type(type: TResponse['body']['type']) {
		this.response.body.type = type
	}

	/**
	 * Convert the response to string
	 */
	public toString() {
		return JSON.stringify(this.response)
	}
}
