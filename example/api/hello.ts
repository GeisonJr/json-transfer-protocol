import { Request, Response, Status } from '../../src' // '@geisonjr/json-transfer-protocol'

export function CREATE(_req: Request, res: Response) {
  res.status = Status.METHOD_NOT_ALLOWED
  res.body = {
    type: 'string',
    data: 'Sorry, this method is not allowed'
  }
}

export function READ(_req: Request, res: Response) {
  res.status = Status.OK
  res.body = {
    type: 'string',
    data: 'Hello world!'
  }
}
