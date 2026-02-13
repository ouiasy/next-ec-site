import z from "zod";
import { PREFECTURES } from "./dataset/prefecture";

export const shippingAddressSchema = z.object({
  lastName: z.string().nonempty(),
  firstName: z.string().nonempty(),
  postalCodeFirst: z
    .string()
    .regex(/^[0-9]{3}$/, "3桁の半角数字を入力してください"),
  postalCodeLast: z
    .string()
    .regex(/^[0-9]{4}$/, "4桁の半角数字を入力してください"),
  prefecture: z.enum(PREFECTURES, "与えられた中から都道府県を選択してください"),
  city: z.string().max(20, "最大20文字まで入力可能です"),
  street: z.string().max(20, "最大20文字まで入力可能です"),
  building: z.string().max(20, "最大20文字まで入力可能です").optional(),
});
