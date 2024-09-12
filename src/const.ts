export const Status = {
	INTERNAL_CLIENT_ERROR: {
		code: 'INTERNAL_CLIENT_ERROR',
		message: 'Internal Client Error',
		description: 'Request went wrong on the client. An accompanying error message will explain further.',
	},
	INTERNAL_SERVER_ERROR: {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Internal Server Error',
		description: 'Something went wrong on the server. An accompanying error message will explain further.',
	},
	BAD_REQUEST: {
		code: 'BAD_REQUEST',
		message: 'Bad Request',
		description: 'The request was invalid or cannot be otherwise served. An accompanying error message will explain further.',
	},
	BAD_RESPONSE: {
		code: 'BAD_RESPONSE',
		message: 'Bad Response',
		description: 'The response was invalid or cannot be otherwise served. An accompanying error message will explain further.',
	},
	NOT_FOUND: {
		code: 'NOT_FOUND',
		message: 'Not Found',
		description: 'The requested resource could not be found. This error can be due to a temporary or permanent condition.',
	},
	OK: {
		code: 'OK',
		message: 'It\'s okay',
		description: 'Request was successful',
	},
	FORBIDDEN: {
		code: 'FORBIDDEN',
		message: 'Forbidden',
		description: 'The client does not have permission to access this resource.',
	},
	METHOD_NOT_ALLOWED: {
		code: 'METHOD_NOT_ALLOWED',
		message: 'Method Not Allowed',
		description: 'A request was made of a resource using a request method not supported by that resource.',
	},
}

export const enum Method {
	CREATE = 'CREATE',
	READ = 'READ',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
}
