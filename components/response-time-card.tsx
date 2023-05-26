import { sql } from "@vercel/postgres"
import { Timer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default async function ResponseTimeCard() {
  let latestResponseTime

  let data
  try {
    data = await sql`SELECT * FROM response_times ORDER BY id DESC LIMIT 1`
  } catch (e) {
    console.log(e)
    throw e
  }

  const { rows } = data

  // Check if any row was found and extract the latest response time
  if (rows.length > 0) {
    latestResponseTime = rows[0].duration / 1000
  } else {
    latestResponseTime = -1
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
        <Timer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{latestResponseTime}s</div>
        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
      </CardContent>
    </Card>
  )
}
