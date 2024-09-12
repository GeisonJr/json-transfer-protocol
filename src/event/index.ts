import { EventEmitter } from 'node:events'
import type { Key, TEvents } from './types'

/**
 * Class to create a events
 */
export class Events<T extends TEvents> {
	private emitter = new EventEmitter()

	get listenersCount() {
		let count = 0
		const events = this.emitter.eventNames()
		for (const event of events) {
			count += this.emitter.listenerCount(event)
		}
		return count
	}

	/**
	 * Emit a event
	 */
	emit<K extends keyof T>(event: K, args: T[K]): boolean {
		return this.emitter.emit(event as Key, args)
	}

	/**
	 * Remove a listener
	 */
	off<K extends keyof T>(event: K, listener: (args: T[K]) => void): this {
		this.emitter.off(event as Key, listener)
		return this
	}

	/**
	 * Add a listener
	 */
	on<K extends keyof T>(event: K, listener: (args: T[K]) => void): this {
		this.emitter.on(event as Key, listener)
		return this
	}

	/**
	 * Add a listener once
	 */
	once<K extends keyof T>(event: K, listener: (args: T[K]) => void): this {
		this.emitter.once(event as Key, listener)
		return this
	}
}
