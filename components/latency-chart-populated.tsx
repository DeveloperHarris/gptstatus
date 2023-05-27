"use client"

import { useContext } from "react"
import { format } from "date-fns"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { CalendarSelectionContext } from "@/app/providers"

const modelColors: Record<string, string> = {
  "text-davinci-003": "#0000FF", // bright blue
  "gpt-3.5-turbo": "#008000", // dark green
  "gpt-4": "#FF8C00", // dark orange
}

type Props = {
  data: Record<string, number | string>[]
}

export default function LatencyChartPopulated({ data }: Props) {
  const { date, setDate } = useContext(CalendarSelectionContext)

  let displayedData
  if (date) {
    const { from, to } = date

    if (from && to) {
      displayedData = data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= from && itemDate <= to
      })
    } else if (from) {
      displayedData = data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= from
      })
    } else if (to) {
      displayedData = data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate <= to
      })
    }
  } else {
    displayedData = data.slice(-720) // 24 hours of data
  }

  if (displayedData == undefined || displayedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-2xl text-gray-500">No data to display</p>
      </div>
    )
  }

  const uniqueModels = Array.from(
    new Set(
      displayedData
        .flatMap((item) => Object.keys(item))
        .filter((key) => key !== "date")
    )
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sort the payload array in descending order based on the 'value' property
      const sortedPayload = [...payload].sort(
        (a: any, b: any) => b.value - a.value
      )

      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #999",
            margin: 0,
            padding: 10,
          }}
        >
          <p className="label">{`Date: ${format(
            new Date(label),
            "MMM dd HH:mm"
          )}`}</p>
          {sortedPayload.map((entry: any) => (
            <p
              key={entry.dataKey}
              className="intro"
              style={{ color: entry.color, fontSize: "10px" }}
            >
              {`${entry.dataKey}: ${entry.value} s`}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        height={400}
        data={displayedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 16 }}
      >
        <CartesianGrid stroke="#ddd" />
        {uniqueModels.map((model) => (
          <Line
            key={model}
            type="monotone"
            dataKey={model}
            stroke={modelColors[model] || "#000"}
            dot={false}
          />
        ))}
        <XAxis
          dataKey="date"
          tickFormatter={(tickItem) => format(new Date(tickItem), "HH:mm")}
          label={{
            value: "Time (UTC)",
            position: "insideBottom",
            offset: -8,
            style: { fontSize: "12px" },
          }}
        />
        <YAxis
          label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  )
}
