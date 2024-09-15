import * as http from './http'
import * as jtp from './jtp'

async function main(): Promise<void> {
  const results = {
    http: await http.main(),
    jtp: await jtp.main()
  }

  // Assuming http and jtp data arrays are the same length
  const resultLength = results.http.length

  for (let i = 0; i < resultLength; i++) {
    const requestCount = results.http[i].total['Total']['Count']
    console.log('Results for ' + requestCount + ' requests')

    if (results.http[i]) {
      console.log('Results for HTTP')
      const res = results.http[i]
      console.table({
        // ...res.motive,
        // '+++': {},
        ...res.result,
        '---': {},
        ...res.total
      })
    }

    if (results.jtp[i]) {
      console.log('Results for JTP')
      const res = results.jtp[i]
      console.table({
        // ...res.motive,
        // '+++': {},
        ...res.result,
        '---': {},
        ...res.total
      })
    }
  }
}

main()
  .then(() => console.log('Done'))
  .catch((err) => console.error(err))
