"use client";
import { ArrowRight } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const CheckoutButton = () => {
	// const [state, formAction, isPending] = useActionState(checkOutAction, null)
	// useEffect(() => {
	//   if (!state) return
	//
	//   if (!state.success && state.message) {
	//     toast.error(state.message)
	//   }
	// }, [state])
	return (
		<form action={formAction}>
			<Button className="w-full cursor-pointer items-center">
				{isPending ? (
					<Spinner />
				) : (
					<>
						<ArrowRight className="" />
						チェックアウト
					</>
				)}
			</Button>
		</form>
	);
};
