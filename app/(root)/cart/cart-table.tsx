import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {ProductType} from "@/types/product.type";
import Image from "next/image";

export const CartTable = (
    items: {
      id: string;
      cartId: string;
      productId: string;
      quantity: number;
      addedAt: number;
      product: ProductType;
    }[],
) => {
  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            return (
                <TableRow key={item.id}>
                  <TableCell>
                    image
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.product}</TableCell>
                </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
};
