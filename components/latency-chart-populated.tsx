"use client"

import { format, parseISO } from "date-fns"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Props = {
  data: { id: string; date: string; duration: number }[]
}

export default function LatencyChartPopulated({ data }: Props) {
  const modifiedData = data.map((item: any) => {
    return {
      ...item,
      duration: item.duration / 1000,
      date: new Date(item.date).toUTCString(),
    }
  })

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props

    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #999",
            margin: 0,
            padding: 10,
          }}
        >
          <p className="label">{`Date : ${format(
            new Date(label),
            "MMM dd HH:mm"
          )}`}</p>
          <p className="intro">{`Response Time (s) : ${payload[0].value}`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart width={400} height={400} data={modifiedData}>
        <Line type="monotone" dataKey="duration" stroke="#8884d8" dot={false} />
        <CartesianGrid stroke="#eee" />
        <XAxis
          dataKey="date"
          tickFormatter={(tickItem) => format(new Date(tickItem), "MMM dd")}
        />
        <YAxis
          label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  )
}
