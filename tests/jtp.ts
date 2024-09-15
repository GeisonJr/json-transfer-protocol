import * as jtp from '../src'
import { TestResults, performTest } from './utils'

async function test() {
  const start = performance.now()

  return await jtp.fetcher({
    head: {
      method: jtp.Method.READ,
      host: '',
      path: '/api/test'
    },
    body: {
      type: 'null',
      data: null
    }
  }, {
    secure: false,
    host: 'localhost',
    port: 6969
  })
    .then((res) => {
      const end = performance.now()

      return {
        success: res.success,
        motive: res.status.code,
        start,
        end
      }
    })
    .catch(() => {
      const end = performance.now()

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
    const server = jtp.createServer({
      secure: false,
      host: 'localhost',
      port: 6969
    })

    // Create a route
    server.read('/api/test', (_req, res) => {
      res.status = jtp.Status.OK
    })

    // Do something when the server starts
    server.socket.on('listening', async () => {
      const res = await performTest(test)
      server.stop()
      resolve(res)
    })

    // Start the server
    server.start()
  })
}
