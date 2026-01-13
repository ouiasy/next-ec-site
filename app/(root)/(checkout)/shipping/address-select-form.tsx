import {useActionState, useState} from "react";
import {AddressCard} from "@/app/(root)/(checkout)/shipping/address-card";
import {FindShippingAddrResponse} from "@/types/dto/response/addr.actions.response";
import {Input} from "@/components/ui/input";
import {selectExistingAddr} from "@/actions/shipping.actions";
import {Button} from "@/components/ui/button";
import {Field} from "@/components/ui/field";


export const AddressSelectForm = ({data}: {data: FindShippingAddrResponse}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(selectExistingAddr, null);

  const onSelectHandler = (id: string) => {
    setSelectedAddressId(id)
  }
  return (
    <form action={formAction}>
      <Field>
        <div className="grid grid-cols-2 gap-4">
          {
            data.addresses.map(addr => (
              <AddressCard key={addr.id} addr={addr}
                           onSelectHandler={onSelectHandler}
                           selectedAddressId={selectedAddressId}
              />
            ))
          }
        </div>

        <Input type="hidden" name="addressId" value={selectedAddressId ?? ""}/>
        <Button type="submit" className="mt-10">select this shipping address</Button>

      </Field>

    </form>

  )
}