import { Timer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type Props = {
  title: string
}

export default function DataCardPlaceolder({ title }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
