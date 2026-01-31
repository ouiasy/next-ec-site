import { createPaypalGateway } from "@/infrastructure/gateway/paypal/paypal-gw";
import { createStripeGateway } from "@/infrastructure/gateway/stripe/stripe-gw";

export const paypalGateway = createPaypalGateway();

// export const stripeGateway = createStripeGateway()
