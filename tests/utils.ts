const NUM_TESTS = 5
const PRECISION = 10

export interface Item {
  start: number
  end: number
  success: boolean
  motive: string
}

export interface Result {
  'Count': number
  '%': number
  'Total': number
  'Average': number
}

export interface Rates {
  [key: string]: Result
}

export interface TestResults {
  result: Rates
  motive: Rates
  total: Rates
}

export function calculateRate(results: Item[], keyExtractor: (item: Item) => string): Rates {
  return results.reduce((acc, curr) => {
    const key = keyExtractor(curr)
    acc[key] = acc[key] ?? {
      'Count': 0,
      '%': 0,
      'Total': 0,
      'Average': 0
    }
    acc[key]['Count']++
    acc[key]['%'] = (acc[key].Count / results.length) * 100
    acc[key]['Total'] += (curr.end - curr.start) / 1000
    acc[key]['Average'] = acc[key]['Total'] / acc[key].Count

    // Round the values
    // acc[key]['Count'] = Number(acc[key]['Count'].toFixed(PRECISION))
    acc[key]['%'] = Number(acc[key]['%'].toFixed(PRECISION))
    acc[key]['Total'] = Number(acc[key]['Total'].toFixed(PRECISION))
    acc[key]['Average'] = Number(acc[key]['Average'].toFixed(PRECISION))

    return acc
  }, {} as Rates)
}

export async function performTestSuite(numberOfRounds: number, callback: () => Promise<Item>): Promise<TestResults> {
  const promises: Promise<Item>[] = []

  for (let i = 0; i < numberOfRounds; i++)
    promises.push(callback())

  return await Promise.all(promises)
    .then(results => {
      return {
        // Calculate the success and error rate
        result: calculateRate(results, (item) => item.success ? 'Success' : 'Error'),
        // Calculate the motives rate
        motive: calculateRate(results, (item) => item.motive),
        // Calculate the total rate
        total: calculateRate(results, () => 'Total')
      }
    })
}

export async function performTest(callback: () => Promise<Item>) {
  const results: TestResults[] = []

  let numberOfRounds = 1
  for (let i = 1; i <= NUM_TESTS; i++) {
    results.push(await performTestSuite(numberOfRounds, callback))
    numberOfRounds *= 10
  }

  return results
}

