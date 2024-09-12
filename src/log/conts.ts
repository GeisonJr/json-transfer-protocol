export const enum LEVEL {
	DEBUG = 'DEBUG',
	ERROR = 'ERROR',
	FATAL = 'FATAL',
	INFO = 'INFO',
	TRACE = 'TRACE',
	WARN = 'WARN',
}

export const enum OUTPUT {
	CONSOLE = 'console',
	JSON = 'json',
	LOG = 'log',
}

export const enum BACKGROUNDS {
	black = '\x1b[40m',
	blackVariant = '\x1b[100m',
	blue = '\x1b[44m',
	blueVariant = '\x1b[104m',
	cyan = '\x1b[46m',
	cyanVariant = '\x1b[106m',
	green = '\x1b[42m',
	greenVariant = '\x1b[102m',
	magenta = '\x1b[45m',
	magentaVariant = '\x1b[105m',
	red = '\x1b[41m',
	redVariant = '\x1b[101m',
	white = '\x1b[47m',
	whiteVariant = '\x1b[107m',
	yellow = '\x1b[43m',
	yellowVariant = '\x1b[103m',
}

export enum FOREGROUNDS {
	black = '\x1b[30m',
	blackVariant = '\x1b[90m',
	blue = '\x1b[34m',
	blueVariant = '\x1b[94m',
	cyan = '\x1b[36m',
	cyanVariant = '\x1b[96m',
	green = '\x1b[32m',
	greenVariant = '\x1b[92m',
	magenta = '\x1b[35m',
	magentaVariant = '\x1b[95m',
	red = '\x1b[31m',
	redVariant = '\x1b[91m',
	white = '\x1b[37m',
	whiteVariant = '\x1b[97m',
	yellow = '\x1b[33m',
	yellowVariant = '\x1b[93m',
}

export enum STYLES {
	blink = '\x1b[5m',
	bright = '\x1b[1m',
	dashed = '\x1b[9m',
	dim = '\x1b[2m',
	hidden = '\x1b[8m',
	italic = '\x1b[3m',
	reset = '\x1b[0m',
	reverse = '\x1b[7m',
	underscore = '\x1b[4m',
}
