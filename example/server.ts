import '@geisonjr/envfy/config'
import * as path from 'node:path'
import { Method, Server } from '../src' // '@geisonjr/json-transfer-protocol'
import { scanDirectory } from './utils'

const server = new Server()

server.start()

// Set the directory to scan for endpoints
const directory = path.join(__dirname, 'api')

// Scans the directory for files
const files = scanDirectory(directory)
  // Filters only TypeScript files
  .filter(file => file.ext === '.ts')

for (const file of files) {
  // Joins the directory with the filename
  const fullname = path.join(file.dir, file.base)

  // Imports the endpoint
  const endpoint = require(fullname)

  // Runs the endpoint for each method in the file
  for (const method in endpoint) {

    // Skips if the method is not a valid method
    if (![Method.CREATE, Method.READ, Method.UPDATE, Method.DELETE].includes(method as Method))
      continue

    // Converts the method to lowercase
    const methodLower = method.toLowerCase() as Lowercase<Method>

    // Defines the relative path to the endpoint
    const relative = path.relative(directory, file.dir)

    // Defines the pathname for the endpoint
    const pathname = '/api/' + [
      // Add the relative path to the endpoint
      relative,
      // Add the filename if it's not 'index'
      file.name === 'index' ? '' : file.name
    ]
      // Remove empty strings
      .filter(Boolean)
      // Join the parts with a slash
      .join('/')

    // Register the endpoint
    server[methodLower](pathname, endpoint[method])
  }
}

// Prints the routes
console.log(server.router.routes)
