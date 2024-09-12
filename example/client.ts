import '@geisonjr/envfy/config'
import { fetcher, Method } from '../src' // '@geisonjr/json-transfer-protocol'

async function run() {

	const response = await fetcher({
		head: {
			host: 'example.com',
			method: Method.CREATE,
			path: '/api/123'
		},
		body: {
			type: 'object',
			data: {
				name: 'Geison',
				age: 23
			}
		}
	})

	// Check if the response was successful
	if (!response.success) {
		// Get the error data from the response
		console.error(response.data)
	}

	// Get the data from the response
	console.log(response.data)
}

run()
