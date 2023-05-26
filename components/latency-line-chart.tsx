"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

export default function LatencyLineChart() {
  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 800, pv: 3000, amt: 2210 },
    { name: "Page C", uv: 600, pv: 2000, amt: 2290 },
    { name: "Page D", uv: 1200, pv: 2780, amt: 2000 },
    { name: "Page E", uv: 700, pv: 1890, amt: 2181 },
    { name: "Page F", uv: 500, pv: 2390, amt: 2500 },
    { name: "Page G", uv: 1100, pv: 3490, amt: 2100 },
    { name: "Page H", uv: 900, pv: 4000, amt: 2400 },
    { name: "Page I", uv: 300, pv: 4300, amt: 2100 },
    { name: "Page J", uv: 1000, pv: 2400, amt: 2900 },
    { name: "Page K", uv: 500, pv: 2700, amt: 2300 },
    { name: "Page L", uv: 600, pv: 2250, amt: 2500 },
    { name: "Page M", uv: 800, pv: 2600, amt: 2000 },
    { name: "Page N", uv: 700, pv: 3000, amt: 2200 },
    { name: "Page O", uv: 900, pv: 3300, amt: 2300 },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  )
}
