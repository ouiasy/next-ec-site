"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link";

type PaymentMethod = "paypal" | "stripe" | "cashondelivery"

type PaymentOption = {
  id: PaymentMethod
  name: string
  description: string
  icon: React.ReactNode
  logo?: string
}

const paymentOptions: PaymentOption[] = [
  {
    id: "stripe",
    name: "クレジットカード",
    description: "Visa、Mastercard、JCBなどに対応",
    icon: <CreditCard className="h-6 w-6" />,
    logo: "Stripe",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "PayPalアカウントで安全に決済",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21l.84-5.326.006-.04a.793.793 0 0 1 .787-.679h1.641c3.238 0 5.774-1.317 6.514-5.12.256-1.317.192-2.453-.3-3.327l-.252-.326c.337-.108.684-.19 1.042-.251.366.741.579 1.528.579 2.362 0 .253-.02.498-.06.74.252.326.492.741.552 1.446z" />
        <path
          d="M18.332 6.668c-.337.062-.684.144-1.042.252-.492-.88-.99-1.446-1.446-1.446H8.937a.793.793 0 0 0-.787.679l-1.573 9.967-.006.04a.483.483 0 0 0 .477.558h3.35l.84-5.326.006-.04a.793.793 0 0 1 .787-.679h1.641c3.238 0 5.774-1.317 6.514-5.12.04-.242.06-.487.06-.74 0-.834-.223-1.621-.579-2.362a5.756 5.756 0 0 0-1.335.217z" />
      </svg>
    ),
  },
  {
    id: "cashondelivery",
    name: "代金引換",
    description: "商品受取時に現金でお支払い",
    icon: <Truck className="h-6 w-6" />,
  },
]

export function PaymentMethodSelector() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  const handleContinue = () => {
    if (selectedMethod) {
      console.log("Selected payment method:", selectedMethod)
      // ここで決済処理に進む
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 md:py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-3xl">お支払い方法の選択</h1>
        <p className="text-pretty text-muted-foreground">ご希望の決済方法を選択してください</p>
      </div>

      <div className="space-y-4">
        {paymentOptions.map((option) => (
          <Card
            key={option.id}
            className={cn(
              "group relative cursor-pointer overflow-hidden border-2 transition-all hover:border-primary/50 py-0",
              selectedMethod === option.id ? "border-primary bg-accent" : "border-border",
            )}
            onClick={() => setSelectedMethod(option.id)}
          >
            <div className="flex items-center gap-4 p-6">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  selectedMethod === option.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                )}
              >
                {option.icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-none">{option.name}</h3>
                  {option.logo && <span className="text-xs text-muted-foreground">powered by {option.logo}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>

              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  selectedMethod === option.id ? "border-primary bg-primary" : "border-muted-foreground/25",
                )}
              >
                {selectedMethod === option.id && <Check className="h-4 w-4 text-primary-foreground" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" className="sm:w-auto bg-transparent" asChild>
          <Link href="/shipping">
            戻る
          </Link>
        </Button>
        <Button size="lg" onClick={handleContinue} disabled={!selectedMethod} className="sm:w-auto" asChild>
          次へ進む
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">安全な決済環境でお客様の情報を保護しています</p>
    </div>
  )
}
