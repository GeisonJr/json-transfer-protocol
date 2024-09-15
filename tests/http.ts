import { isUndefined } from '@geisonjr/typefy'
import * as http from 'http'
import { performTest, TestResults } from './utils'

async function test() {
  const start = performance.now()

  return await fetch('http://localhost:3000', {})
    .then((res) => {
      const end = performance.now()

      return {
        success: res.ok,
        motive: res.statusText,
        start,
        end
      }
    })
    .catch((err) => {
      const end = performance.now()

      // @ts-ignore
      if (!isUndefined(err.cause)) {
        // @ts-ignore
        if (!isUndefined(err.cause.code)) {
          return {
            success: false,
            // @ts-ignore
            motive: err.cause.code,
            start,
            end
          }
        }
      }

      return {
        success: false,
        motive: 'Failed to fetch',
        start,
        end
      }
    })
}

export async function main() {
  return new Promise<TestResults[]>((resolve) => {
    // Server
    const server = http.createServer()

    // Create a route
    server.on('request', (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Hello World\n')
    })

    // Do something when the server starts
    server.on('listening', async () => {
      const res = await performTest(test)
      server.close()
      resolve(res)
    })

    // Start the servers
    server.listen(3000, 'localhost')
  })
}
