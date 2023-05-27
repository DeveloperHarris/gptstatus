"use client"

import { createContext, useState } from "react"
import { DateRange } from "react-day-picker"

export const CalendarSelectionContext = createContext<{
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}>({
  date: undefined,
  setDate: () => {},
})

export function CalendarSelectionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [date, setDate] = useState<DateRange | undefined>(undefined)

  return (
    <CalendarSelectionContext.Provider value={{ date, setDate }}>
      {children}
    </CalendarSelectionContext.Provider>
  )
}
