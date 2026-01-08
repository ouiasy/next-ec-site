"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {MoveRight} from "lucide-react";
import Link from "next/link";

import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {shippingAddressSchema} from "@/zod/shipping-address.zod";
import {handleShippingAddr} from "@/actions/shipping.actions";
import {prefectures} from "@/zod/dataset/prefecture";
import {addressTable} from "@/db/schema/address.schema";

export const ShippingAddrForm = ({
                                   address,
                                 }: {
  address: typeof addressTable.$inferSelect | undefined;
}) => {
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: address?.name || "",
      postalCode: address?.postalCode || "",
      prefecture: address?.prefecture || "",
      city: address?.city || "",
      street: address?.street || "",
      building: address?.building || "",
    },
  });

  return (
      <form
          id="shipping-addr"
          onSubmit={form.handleSubmit(handleShippingAddr)}
          className="w-md mx-auto"
      >
        <FieldGroup>
          <Controller
              name="name"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">氏名</FieldLabel>
                    <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="氏名"
                        autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
              )}
          />
          <Controller
              name="postalCode"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="postal-code">郵便番号</FieldLabel>
                    <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="107-0052"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
              )}
          />
          <Controller
              name="prefecture"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="prefecture">都道府県</FieldLabel>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="都道府県を選択"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {prefectures.map((prefecture) => {
                            return (
                                <SelectItem value={prefecture} key={prefecture}>
                                  {prefecture}
                                </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
              )}
          />
          <Controller
              name="city"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">市区町村</FieldLabel>
                    <Input
                        {...field}
                        id="city"
                        aria-invalid={fieldState.invalid}
                        placeholder="市区町村"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
              )}
          />
          <Controller
              name="street"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="street">丁目・番地・号</FieldLabel>
                    <Input
                        {...field}
                        id="street"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
              )}
          />
          <Controller
              name="building"
              control={form.control}
              render={({field, fieldState}) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="building">
                      建物名／会社名・部屋番号
                    </FieldLabel>
                    <Input
                        {...field}
                        id="building"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
              )}
          />
          <Button
              type="submit"
              form="shipping-addr"
              className="cursor-pointer"
              asChild
          >
            <Link href="/payment">
              <MoveRight/> 支払い方法の選択
            </Link>
          </Button>
        </FieldGroup>
      </form>
  );
};
