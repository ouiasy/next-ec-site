"use client"
import {AddressRegisterForm} from "./address-register-form";
import {FindShippingAddrResponse} from "@/types/dto/response/addr.actions.response";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {AddressSelectForm} from "@/app/(root)/(checkout)/shipping/address-select-form";

export const AddressManager = ({data}: {data: FindShippingAddrResponse}) => {
  const [showAddressForm, setShowAddressForm] = useState(false)

  const onCloseHandler = () => {
    setShowAddressForm(false)
  }

  return (
    <div className="space-y-4 flex gap-6 p-3">
      <div className={
        cn("",
        showAddressForm ? 'w-1/2' : 'w-3/4 mx-auto'
      )}>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl">Saved Addresses</h3>
          <Button className="bg-transparent"
                  variant="outline"
                  onClick={() => setShowAddressForm(true)}
                  disabled={showAddressForm}
          >
            <Plus className="w-6 h-6"/>
            register new address
          </Button>
        </div>
        <AddressSelectForm data={data}/>


      </div>

      <div className={cn("transition-all duration-300",
          showAddressForm ? 'w-1/2 opacity-100' : 'w-0 opacity-0',
        )}>
        <AddressRegisterForm onClose={onCloseHandler}/>
      </div>

    </div>
  )
}