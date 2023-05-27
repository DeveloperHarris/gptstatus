import { Suspense } from "react"
import { ArrowUpDown, Gauge, Timer } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataCard from "@/components/data-card"
import DataCardPlaceholder from "@/components/data-card-placeholder"

const models = [
  {
    name: "GPT 4",
    value: "gpt-4",
  },
  {
    name: "GPT 3.5 Turbo",
    value: "gpt-3.5-turbo",
  },
  {
    name: "Text Davinci 003",
    value: "text-davinci-003",
  },
  {
    name: "Palm",
    value: "palm",
    disabled: true,
  },
]

const cards = [
  {
    title: "Response Time",
    datapoint: "duration",
    modifier: (datapoint: string) => `${Number(datapoint) / 1000}`,
    unit: "s",
    Icon: Timer,
  },
  {
    title: "Time To First Byte",
    datapoint: "ttfb",
    unit: "ms",
    Icon: ArrowUpDown,
  },
  {
    title: "Tokens Per Second",
    datapoint: "tps",
    Icon: Gauge,
  },
]

export default function ModelCards() {
  return (
    <Tabs defaultValue={models[0].value} className="space-y-4">
      <TabsList>
        {models.map(
          (model: { name: string; value: string; disabled?: boolean }) => {
            return (
              <TabsTrigger value={model.value} disabled={model.disabled}>
                {model.name}
              </TabsTrigger>
            )
          }
        )}
      </TabsList>
      {models.map((model: { name: string; value: string }) => {
        return (
          <TabsContent value={model.value} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => (
                <Suspense
                  fallback={<DataCardPlaceholder title="Response Time" />}
                >
                  {/* @ts-expect-error Async Server Component */}
                  <DataCard
                    title={card.title}
                    model={model.value}
                    datapoint={card.datapoint}
                    modifier={card.modifier}
                    unit={card.unit}
                    Icon={card.Icon}
                  />
                </Suspense>
              ))}
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
