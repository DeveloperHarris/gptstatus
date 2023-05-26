import { Suspense } from "react"
import { sql } from "@vercel/postgres"
import { Activity, ArrowUpDown, Download, Gauge, Timer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/calender-date-range-picker"
import LatencyChart from "@/components/latency-chart"
import LatencyChartPlaceholder from "@/components/latency-chart-placeholder"
import ResponseTimeCard from "@/components/response-time-card"
import ResponseTimeCardPlaceholder from "@/components/response-time-card-placeholder"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Suspense fallback={<LatencyChartPlaceholder />}>
            {/* @ts-expect-error Async Server Component */}
            <LatencyChart />
          </Suspense>
        </CardContent>
      </Card>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">GPT 4</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            GPT 3.5 Turbo
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            GPT 3
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            PALM
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<ResponseTimeCardPlaceholder />}>
              {/* @ts-expect-error Async Server Component */}
              <ResponseTimeCard />
            </Suspense>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time To First Byte (TTFB)
                </CardTitle>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                {/* <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tokens Per Second
                </CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                {/* <p className="text-xs text-muted-foreground">
              +19% from last month
            </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.4%</div>
                {/* <p className="text-xs text-muted-foreground">-1% from last month</p> */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
