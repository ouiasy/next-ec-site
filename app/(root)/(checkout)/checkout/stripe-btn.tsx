"use client";
import { useActionState } from "react";
import { stripeCheckout } from "@/actions/checkout.actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const StripeButton = () => {
	const [state, formAction, isPending] = useActionState(stripeCheckout, null);
	return (
		<form action={formAction}>
			<Button className="w-full">
				{isPending ? <Spinner /> : "Stripeで決済"}
			</Button>
		</form>
	);
};
