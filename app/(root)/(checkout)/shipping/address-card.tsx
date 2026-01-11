import {Check, MapPin} from "lucide-react"
import {Item} from "@/components/ui/item";
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

type AddressCardProps = {
  addr: {
    id: string,
    lastName: string,
    firstName: string,
    postalCode: string,
    prefecture: string,
    city: string,
    street: string,
    building?: string | null,
    isDefault: boolean,
  }
  selectedAddressId: string | null,
  onSelectHandler: (id: string) => void
}

export const AddressCard = ({addr, selectedAddressId, onSelectHandler}: AddressCardProps) => {

  const isSelected = addr.id === selectedAddressId;

  return (
    <Item variant="outline" key={addr.id}
          onClick={() => onSelectHandler(addr.id)}
          className={cn("relative border-2 shadow-sm p-4 hover:shadow-md transition-all duration-300",
            isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50",
            )}>
      {
        isSelected &&
          <div className="absolute right-5 top-5 rounded-full bg-primary flex items-center justify-center h-6 w-6">
              <Check className="w-4 h-4 text-primary-foreground"/>
          </div>
      }
      {
        !addr.isDefault &&
          <Badge className="absolute -left-3 -top-3 p-1.5 bg-secondary-foreground">Default</Badge>
      }

      <div className=" flex gap-2">
        <MapPin className="w-5 h-5 shrink-0 block items-center mt-2 text-muted-foreground"/>
        <div>
          <p className="text-xl">{addr.lastName}{" "}{addr.firstName}</p>
          <p className="text-muted-foreground text-sm">
            〒{addr.postalCode.slice(0, 3) + "-" + addr.postalCode.slice(3)}
          </p>
          <p className="text-sm">{addr.prefecture}</p>
          <p className="text-sm">{addr.city + addr.street + addr.building}</p>
        </div>
      </div>

    </Item>
  )

}