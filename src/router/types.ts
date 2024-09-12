import { Method } from '../const'
import { Request } from '../request'
import { Response } from '../response'

export type Handler = (req: Request, res: Response) => void
export type Pathname = string

export interface Route {
	handler: Handler
	method: Method
	middlewares: Handler[]
	pathname: Pathname
}

export interface Routes {
	[method: string]: {
		[pathname: string]: Route
	}
}
