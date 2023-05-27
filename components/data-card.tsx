import { sql } from "@vercel/postgres"
import { LucideIcon, Timer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type Props = {
  title: string
  subtitle?: string
  model: string
  datapoint: string
  modifier?: (datapoint: string) => string | undefined
  unit: string | undefined
  Icon: LucideIcon
}

export default async function DataCard({
  title,
  subtitle,
  model,
  datapoint,
  modifier,
  unit,
  Icon,
}: Props) {
  let data
  try {
    // Fetch the latest response time for the specific model
    data =
      await sql`SELECT * FROM response_times WHERE model=${model} ORDER BY id DESC LIMIT 1`
  } catch (e) {
    console.log(e)
    throw e
  }

  const { rows } = data

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex h-8 flex-col">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardTitle className="text-xs font-light text-muted-foreground">
            {subtitle ? subtitle : ""}
          </CardTitle>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {rows[0]
            ? modifier
              ? `${modifier(rows[0][datapoint])}${unit ? unit : ""}`
              : `${rows[0][datapoint]}${unit ? unit : ""}`
            : "N/A"}
        </div>
        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
      </CardContent>
    </Card>
  )
}
