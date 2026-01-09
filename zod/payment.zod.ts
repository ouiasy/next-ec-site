import {z} from "zod";
import { PAYMENT_METHODS } from "@/lib/constants";

export const paymentMethodSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
})

