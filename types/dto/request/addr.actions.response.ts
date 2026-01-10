import {shippingAddressSchema} from "@/zod/shipping-address.zod";
import {z} from "zod";

export type ShippingAddrFormData = z.infer<typeof shippingAddressSchema>

export type RegisterShippingAddrResponse = {
  success: boolean,
  message: string,
  fieldData?: {
    lastName: string,
    firstName: string,
    postalCodeFirst: string,
    postalCodeLast: string,
    prefecture: string,
    city: string,
    street: string,
    building?: string,
  }
  formErrors?: string[],
  fieldErrors?: Record<string, string[]>,
}

