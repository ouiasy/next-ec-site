import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CartProps } from "./cart-table";
import React from "react";

export const TotalPriceCard = ({ items }: CartProps) => {
  return (
    <Card className="text-center w-full">
      <CardHeader>
        <CardTitle className="text-xl">カート総計</CardTitle>
      </CardHeader>
      <CardContent className="">
        {items.map((item) => {
          return (
            <React.Fragment key={item.id}>
              <h3 key={item.id} className="text-left text-xl">
                {item.product.name}
              </h3>
              <p></p>
            </React.Fragment>
          );
        })}

        <p>Card Content</p>
      </CardContent>
    </Card>
  );
};
