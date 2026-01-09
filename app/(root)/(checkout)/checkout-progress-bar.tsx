"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CheckoutProgressBarProps {
  currentStep: number // 0-3
  className?: string
}

const steps = [
  "ユーザーログイン",
  "配送先住所",
  "支払い方法の選択",
  "注文の確定",
]

export function CheckoutProgressBar({ currentStep, className }: CheckoutProgressBarProps) {
  const [animatedStep, setAnimatedStep] = useState(-1)

  useEffect(() => {
    // Initial animation: gradually reveal progress up to current step
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div className={cn("w-full px-4 py-8", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="relative flex items-start justify-between">
          {/* Progress Line Background */}
          <div className="absolute left-0 top-6 h-0.5 w-full bg-muted" />

          {/* Animated Progress Line */}
          <div
            className="absolute left-0 top-6 h-0.5 bg-primary transition-all duration-1000 ease-out"
            style={{
              width: animatedStep >= 0 ? `${(animatedStep / (steps.length - 1)) * 100}%` : "0%",
            }}
          />

          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep
            const shouldAnimate = index <= animatedStep

            return (
              <div key={index} className="relative z-10 flex flex-1 flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold transition-all duration-500",
                    shouldAnimate && isCompleted && "border-primary bg-primary text-primary-foreground",
                    shouldAnimate &&
                    isCurrent &&
                    "scale-110 border-primary bg-primary text-primary-foreground shadow-lg",
                    (!shouldAnimate || isUpcoming) && "border-muted bg-background text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>

                {/* Step Label and Description */}
                <div className="mt-3 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      shouldAnimate && (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
