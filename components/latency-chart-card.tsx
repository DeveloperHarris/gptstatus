import { Suspense } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LatencyChart from "@/components/latency-chart"
import LatencyChartPlaceholder from "@/components/latency-chart-placeholder"

export default function LatencyChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="w-full pl-2">
        <Suspense fallback={<LatencyChartPlaceholder />}>
          {/* @ts-expect-error Async Server Component */}
          <LatencyChart />
        </Suspense>
      </CardContent>
    </Card>
  )
}
