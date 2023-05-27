import { CalendarDateRangePicker } from "@/components/calender-date-range-picker"
import LatencyChartCard from "@/components/latency-chart-card"
import ModelCards from "@/components/model-cards"

export const revalidate = 300

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <LatencyChartCard />
      <ModelCards />
    </section>
  )
}
