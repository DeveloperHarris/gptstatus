import { Timer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function ResponseTimeCardPlaceolder() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
        <Timer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">42s</div>
        {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
      </CardContent>
    </Card>
  )
}
