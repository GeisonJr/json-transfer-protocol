/**
 * Replace all cycular references with a string
 */
export function decycle(obj: Object) {
	const seen = new WeakSet()

	function replacer(_key: string, value: any) {
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) {
				return '[Circular]'
			}
			seen.add(value)
		}
		return value
	}

	return JSON.stringify(obj, replacer)
}
