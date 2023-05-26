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

  return (
    <LatencyLineChart
      data={rows.map((row) => ({
        id: String(row.id),
        date: String(row.date),
        duration: Number(row.duration),
      }))}
    />
  )
}
