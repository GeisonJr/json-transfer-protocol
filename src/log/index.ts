import * as envfy from '@geisonjr/envfy'
import { isArray, isBoolean, isNull, isNumber, isObject, isUndefined } from '@geisonjr/typefy'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { decycle } from '../util/json'
import { BACKGROUNDS, FOREGROUNDS, LEVEL, OUTPUT, STYLES } from './conts'
import type { Data, Message } from './types'

/**
 * Class to create a log
 */
export class Log {
	private maxSize: number
	private outputs: OUTPUT[] = []
	private levels: LEVEL[] = []
	private isActive: boolean
	private logStream: fs.WriteStream | null = null
	private jsonStream: fs.WriteStream | null = null

	constructor(private name: string, private dir: string = process.cwd() + '/.logs') {
		name = name.replace(/[^a-zA-Z0-9]/g, '_')
		dir = envfy.string('LOG_DIR', dir)

		this.isActive = envfy.boolean('LOG', false)
		this.maxSize = envfy.number('LOG_MAX', 1000000)

		// Set outputs
		if (envfy.boolean('LOG_CONSOLE', true)) this.outputs.push(OUTPUT.CONSOLE)
		if (envfy.boolean('LOG_JSON', false)) this.outputs.push(OUTPUT.JSON)
		if (envfy.boolean('LOG_LOG', false)) this.outputs.push(OUTPUT.LOG)

		// Set levels
		if (envfy.boolean('LOG_DEBUG', true)) this.levels.push(LEVEL.DEBUG)
		if (envfy.boolean('LOG_INFO', true)) this.levels.push(LEVEL.INFO)
		if (envfy.boolean('LOG_WARN', true)) this.levels.push(LEVEL.WARN)
		if (envfy.boolean('LOG_ERROR', true)) this.levels.push(LEVEL.ERROR)
		if (envfy.boolean('LOG_FATAL', true)) this.levels.push(LEVEL.FATAL)
		if (envfy.boolean('LOG_TRACE', true)) this.levels.push(LEVEL.TRACE)

		// Initialize streams if needed
		if (this.outputs.includes(OUTPUT.LOG)) {
			const filename = this.prepareFile(OUTPUT.LOG)
			this.logStream = fs.createWriteStream(filename, { flags: 'a' })
		}

		if (this.outputs.includes(OUTPUT.JSON)) {
			const filename = this.prepareFile(OUTPUT.JSON)
			this.jsonStream = fs.createWriteStream(filename, { flags: 'a' })
		}
	}

	private prepareFile(output: OUTPUT): string {
		const timestamp = new Date().toISOString().slice(0, 10)
		let filename = `${timestamp}.${this.name}.${output}`
		let pathname = path.join(this.dir, filename)

		// Verify if the directory exists
		if (!fs.existsSync(this.dir)) {
			fs.mkdirSync(this.dir, { recursive: true })
			return pathname
		}

		// Verify if the file exists
		if (!fs.existsSync(pathname)) {
			fs.writeFileSync(pathname, '')
			return pathname
		}

		// Verify if the maximum size has been reached
		const stats = fs.statSync(pathname)
		if (stats.size < this.maxSize)
			return pathname

		// Prepare the new filename and pathname for the old file
		let index = 1
		let newFilename = `${timestamp}.${this.name}.${output}.${index}`
		let newPathname = path.join(this.dir, newFilename)
		while (fs.existsSync(newPathname)) {
			newFilename = `${timestamp}.${this.name}.${index}.${output}`
			newPathname = path.join(this.dir, newFilename)
			index++
		}

		// Rename the file
		fs.renameSync(pathname, newPathname)

		return pathname
	}

	private write(level: LEVEL, description: string, ...messages: Message[]) {
		if (!this.isActive) return

		if (!this.levels.length)
			return

		if (!this.outputs.length)
			return

		if (!this.levels.includes(level))
			return

		const timestamp = new Date().toISOString()

		const data: Data = {
			level,
			description,
			timestamp,
			data: messages.map((message, index) => {
				const type = typeof message

				if (isBoolean(message) || isNull(message) || isNumber(message) || isUndefined(message))
					message = String(message)
				else if (isArray(message) || isObject(message))
					message = decycle(message)

				return {
					type,
					index: index + 1,
					message,
				}
			}),
		}

		if (this.outputs.includes(OUTPUT.JSON))
			this.json(data)

		if (this.outputs.includes(OUTPUT.LOG))
			this.log(data)

		if (this.outputs.includes(OUTPUT.CONSOLE))
			this.console(data)
	}

	private console(data: Data) {
		let levelStyle = ''

		if (data.level === LEVEL.DEBUG)
			levelStyle += FOREGROUNDS.blue
		else if (data.level === LEVEL.ERROR)
			levelStyle += FOREGROUNDS.red
		else if (data.level === LEVEL.FATAL)
			levelStyle += FOREGROUNDS.red + BACKGROUNDS.white
		else if (data.level === LEVEL.INFO)
			levelStyle += FOREGROUNDS.green
		else if (data.level === LEVEL.TRACE)
			levelStyle += FOREGROUNDS.cyan
		else if (data.level === LEVEL.WARN)
			levelStyle += FOREGROUNDS.yellow

		let output = [
			`${levelStyle}[${data.level}]`,
			`${FOREGROUNDS.blackVariant}${data.timestamp}`,
			`${data.description}`,
			`${data.data
				.reduce((acc, message) => {
					return acc + `\n${STYLES.reset}${FOREGROUNDS.blue}${String(message.index)}${STYLES.reset}:[${FOREGROUNDS.cyan}${message.type}${STYLES.reset}] ${message.message}${STYLES.reset}`
				}, '')
				.replace(/\"/g, '"')}`,
		].join(`${STYLES.reset} `)

		output += '\n'

		process.stdout.write(output)
	}

	private log(data: Data) {
		let output = [
			`[${data.level}]`,
			`${data.timestamp}`,
			`${data.description}`,
			`${data.data
				.reduce((acc, message) => {
					return acc + `${String(message.index)}:[${message.type}] ${message.message} `
				}, '')
				.replace(/\"/g, '"')
				.replace(/\\n/g, ' ')
				.trim()}`,
		].join(' ')

		output += '\n'

		this.logStream?.write(output)
	}

	private json(data: Data) {
		let output = JSON.stringify(data)

		output += '\n'

		this.jsonStream?.write(output)
	}

	public debug(description: string, ...messages: Message[]): void {
		this.write(LEVEL.DEBUG, description, ...messages)
	}

	public error(description: string, ...messages: Message[]): void {
		this.write(LEVEL.ERROR, description, ...messages)
	}

	public fatal(description: string, ...messages: Message[]): void {
		this.write(LEVEL.FATAL, description, ...messages)
	}

	public info(description: string, ...messages: Message[]): void {
		this.write(LEVEL.INFO, description, ...messages)
	}

	public trace(description: string, ...messages: Message[]): void {
		this.write(LEVEL.TRACE, description, ...messages)
	}

	public warn(description: string, ...messages: Message[]): void {
		this.write(LEVEL.WARN, description, ...messages)
	}
}

/**
 * Create a new Log
 */
export function createLog(name: string, dir?: string): Log {
	return new Log(name, dir)
}
