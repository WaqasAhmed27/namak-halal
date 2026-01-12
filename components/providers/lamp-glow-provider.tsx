"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface LampGlowContextType {
  isGlowOn: boolean
  toggleGlow: () => void
  setGlow: (on: boolean) => void
}

const LampGlowContext = createContext<LampGlowContextType | undefined>(undefined)

export function LampGlowProvider({ children }: { children: ReactNode }) {
  const [isGlowOn, setIsGlowOn] = useState(true)

  const toggleGlow = useCallback(() => {
    setIsGlowOn((prev) => !prev)
  }, [])

  const setGlow = useCallback((on: boolean) => {
    setIsGlowOn(on)
  }, [])

  return <LampGlowContext.Provider value={{ isGlowOn, toggleGlow, setGlow }}>{children}</LampGlowContext.Provider>
}

export function useLampGlow() {
  const context = useContext(LampGlowContext)
  if (context === undefined) {
    throw new Error("useLampGlow must be used within a LampGlowProvider")
  }
  return context
}
