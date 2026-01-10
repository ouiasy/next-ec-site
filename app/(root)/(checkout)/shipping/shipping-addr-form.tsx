"use client";

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {prefectures} from "@/zod/dataset/prefecture";
import {Button} from "@/components/ui/button";
import {useActionState, useEffect} from "react";
import {registerShippingAddr} from "@/api/actions/shipping.actions";
import {Spinner} from "@/components/ui/spinner";
import {RegisterShippingAddrResponse} from "@/types/dto/request/addr.actions.response";
import {toast} from "sonner";

const initialState: RegisterShippingAddrResponse = {
  success: true,
  message: "",
}

export const ShippingAddrForm = () => {
  const [state, formAction, isPending] = useActionState(registerShippingAddr, initialState)

  return (

    <form action={formAction}>
      {state.formErrors}
      <FieldGroup className="">
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>lastName</FieldLabel>
            <Input type="text" required name="lastName" defaultValue={state.fieldData?.lastName}/>
            <FieldError>{state.fieldErrors?.["lastName"]}</FieldError>
          </Field>
          <Field>
            <FieldLabel>firstName</FieldLabel>
            <Input type="text" required name="firstName" defaultValue={state.fieldData?.firstName}/>
            <FieldError>{state.fieldErrors?.["firstName"]}</FieldError>
          </Field>
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <FieldLabel>postalcode</FieldLabel>
          <div className="flex gap-2 items-center">
            <Field className="w-3/7">
              <Input type="text" required name="postalCodeFirst" defaultValue={state.fieldData?.postalCodeFirst}/>
              <FieldError>{state.fieldErrors?.["postalCodeFirst"]}</FieldError>
            </Field>
            <span>-</span>
            <Field className="w-4/7">
              <Input type="text" required name="postalCodeLast" defaultValue={state.fieldData?.postalCodeLast}/>
              <FieldError>{state.fieldErrors?.["postalCodeLast"]}</FieldError>
            </Field>
          </div>

        </div>

        <Field>
          <FieldLabel>prefecture</FieldLabel>
          <Select name="prefecture" required defaultValue={state.fieldData?.prefecture}>
            <SelectTrigger>
              <SelectValue placeholder="prefecture"/>
            </SelectTrigger>
            <SelectContent>
              {
                prefectures.map(prefecture => (
                  <SelectItem value={prefecture} key={prefecture}>{prefecture}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <FieldError>{state.fieldErrors?.["prefecture"]}</FieldError>
        </Field>
        <Field>
          <FieldLabel>city</FieldLabel>
          <Input type="text" required name="city" defaultValue={state.fieldData?.city}/>
          <FieldError>{state.fieldErrors?.["city"]}</FieldError>
        </Field>
        <Field>
          <FieldLabel>street</FieldLabel>
          <Input type="text" required name="street" defaultValue={state.fieldData?.street}/>
          <FieldError>{state.fieldErrors?.["street"]}</FieldError>
        </Field>
        <Field>
          <FieldLabel>building</FieldLabel>
          <Input type="text" name="building" defaultValue={state.fieldData?.building}/>
          <FieldError>{state.fieldErrors?.["building"]}</FieldError>
        </Field>
        <Field>
          {
            isPending ? <Spinner/> :
              <Button type="submit" disabled={isPending}>Submit</Button>
          }
        </Field>
      </FieldGroup>
    </form>
  );
};
