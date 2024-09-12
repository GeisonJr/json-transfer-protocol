import { LEVEL } from './conts'

export interface Data {
	level: LEVEL
	description: string
	data: FormatMessage[]
	timestamp: string
}

export type Message = string | number | boolean | object | undefined | null

export type FormatMessage = {
	index: number
	message: string
	type: string
}

export type Format = {
	data: FormatMessage[]
	description: string
	level: LEVEL
	timestamp: string
}
