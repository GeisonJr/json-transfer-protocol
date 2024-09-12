const { rmSync } = require('fs')

rmSync('./lib', {
	force: true,
	recursive: true
})
