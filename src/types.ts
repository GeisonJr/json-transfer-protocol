import { Status } from './const'

export type TStatus = (typeof Status)[keyof typeof Status]
