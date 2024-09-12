import { isNull } from '@geisonjr/typefy'
import { Method } from '../const'
import { Log } from '../log'
import { uuid } from '../util/uuid'
import type { Handler, Pathname, Route, Routes } from './types'

/**
 * Class to create a Router
 */
export class Router {
	public readonly id: string
	public readonly log: Log
	public readonly routes: Routes = {}

	constructor() {
		this.id = uuid()
		this.log = new Log(this.id)
	}

	/**
	 * Find a route by method and pathname
	 */
	public find(method: Method, pathname: Pathname): null | Route {
		return this.routes[method]?.[pathname] ?? null
	}

	/**
	 * Add a new route to the server
	 */
	public add(method: Method, pathname: Pathname, handler: Handler, ...middlewares: Handler[]): void {

		// Normalize pathname
		if (!/^\//.test(pathname))
			pathname = `/${pathname}`

		// Invalid pathname
		if (!/^\/(?:[a-z0-9-_\.]+\/?)+$/i.test(pathname))
			return this.log.error(`Invalid pathname: "${pathname}". Pathname must contain only letters(a-zA-Z), numbers(0-9), hyphens(-), underscores(_) and dots(.)`)

		// Check if the path is trying to access current directory
		if (/(^|\/)\.(\/|$)/.test(pathname))
			return this.log.error(`Invalid pathname: "${pathname}". Pathname must not access current directory`)

		// Check if the path is trying to access parent directory
		if (/(^|\/)\.\.(\/|$)/.test(pathname))
			return this.log.error(`Invalid pathname: "${pathname}". Pathname must not access parent directory`)


		// Initialize the method if not exists
		if (!this.routes[method])
			this.routes[method] = {}

		// Check if the route already exists
		const route = this.find(method, pathname)

		// If the route does not exist, create a new route
		if (isNull(route)) {
			this.routes[method][pathname] = {
				handler,
				method,
				middlewares,
				pathname
			}
			return
		}

		this.log.warn(`The route "${method.toUpperCase()} ${pathname}" already exists. Overwriting the route.`)
		route.handler = handler
		route.method = method
		route.middlewares = middlewares
		route.pathname = pathname
	}

	/**
	 * Add routes to the server
	 */
	public use(routes: Route[]): void {
		routes.forEach((route) => {
			this.add(
				route.method,
				route.pathname,
				route.handler,
				...(route.middlewares ?? []),
			)
		})
	}
}

/**
 * Create a new Router
 */
export function createRouter(): Router {
	return new Router()
}
