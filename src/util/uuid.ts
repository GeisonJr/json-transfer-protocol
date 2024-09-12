import * as crypto from 'node:crypto'

/**
 * Generate a unique identifier based on a seed
 */
export function uuid(options?: Options) {
	const hash = crypto.createHash('sha256')
	hash.update(options?.seed ?? performance.now().toString())
	return hash.digest('hex')
}

export interface Options {
	seed?: string
}
