import {toast} from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import {useMutation, useQueryClient} from "@tanstack/react-query";


import {client} from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;


export const useDeleteTransactions= (id?:string) =>{
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error
    >({
        mutationFn: async() => {
            const response = await client.api.transactions[":id"]["$delete"]({
                param:{id}
            })
            return await response.json();
        },
        onSuccess: () =>{
            toast.success("Account updated");
            queryClient.invalidateQueries({queryKey:["transaction",{id}]});
            queryClient.invalidateQueries({queryKey:["transactions"]});

        },
        onError: () =>{
            toast.error("Failed to delete account");
        },

    })

    return mutation
}