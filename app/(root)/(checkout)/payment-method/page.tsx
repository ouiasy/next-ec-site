import { PaymentMethodSelector } from "./payment-method-selector"
import { CheckoutProgressBar } from "@/app/(root)/(checkout)/checkout-progress-bar";

const PaymentMethodPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <CheckoutProgressBar currentStep={2}/>
      <PaymentMethodSelector />
    </main>
  )
}

export default PaymentMethodPage;