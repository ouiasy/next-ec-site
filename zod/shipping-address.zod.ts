import z from "zod";
import { prefectures } from "./dataset/prefecture";

export const shippingAddressSchema = z.object({
  name: z.string().min(3, "名前は3文字以上にする必要があります。"),
  postalCode: z
    .string()
    .regex(/^[0-9]{3}[0-9]{4}$/, "9桁の数字を入力してください"),
  prefecture: z.enum(prefectures, "与えられた中から都道府県を選択してください"),
  city: z.string().max(20, "最大20文字まで入力可能です"),
  street: z.string().max(20, "最大20文字まで入力可能です"),
  building: z.string().max(20, "最大20文字まで入力可能です").optional(),
});
