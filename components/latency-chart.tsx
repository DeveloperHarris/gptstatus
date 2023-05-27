import { sql } from "@vercel/postgres"

import LatencyLineChart from "./latency-chart-populated"

export default async function LatencyChart() {
  let data
  try {
    data = await sql`SELECT * FROM response_times`
  } catch (e) {
    console.log(e)
    throw e
  }

  const { rows } = data

  const transformedData = rows.reduce<Record<string, number | string>[]>(
    (acc, row) => {
      const existingEntry = acc.find(
        (entry: Record<string, number | string>) =>
          entry.date === String(row.date)
      )
      if (existingEntry) {
        existingEntry[row.model] = Number(row.duration / 1000)
      } else {
        acc.push({
          date: String(row.date),
          [row.model]: Number(row.duration / 1000),
        })
      }
      return acc
    },
    []
  )

  return <LatencyLineChart data={transformedData} />
}
