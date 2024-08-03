import {} from "@/components/ui/sheet";

import{
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../api/use-edit-transaction ";
import { useDeleteTransactions } from "../api/use-delete-transaction";
import { TransactionForm } from "./transaction-form";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-account";
const formSchema = insertTransactionSchema.omit({
    id:true,
})

type FormValues = z.input<typeof formSchema>;


export const EditTransactionSheet = () =>{
    const {isOpen,onClose,id} = useOpenTransaction();
    const [ConfirmDialog,confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction"
    )
    const accountMutation = useCreateAccount();
    const categoryQuery = useGetCategories();
    const accountQuery = useGetAccounts();
    const TransactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransactions(id);
    const isPending = editMutation.isPending || deleteMutation.isPending || TransactionQuery.isLoading || accountMutation.isPending
    const isLoading = TransactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

    const categoryMutation = useCreateCategory();


    const onCreateCategory = (name:string) => categoryMutation.mutate({
        name
    })

    const categoryOptions= (categoryQuery.data ?? []).map((category)=>({
        label: category.name,
        value: category.id,
    }))



    const onCreateAccount = (name:string) => categoryMutation.mutate({
        name
    })

    const accountOptions= (accountQuery.data ?? []).map((account)=>({
        label: account.name,
        value: account.id,
    }))
    
    const onSubmit = (values:FormValues) =>{
        editMutation.mutate(values,{
            onSuccess: () =>{
                onClose();
            }
        })
    }

    const defaultValues = TransactionQuery.data?{
        accountId: TransactionQuery.data.accountId,
        categoryId: TransactionQuery.data.categoryId,
        amount: TransactionQuery.data.amount.toString(),
        date: TransactionQuery.data.date
        ? new Date(TransactionQuery.data.date)
        : new Date(),
        payee: TransactionQuery.data.payee,
        notes: TransactionQuery.data.notes,

    }:{
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: ""
        
    }

    const onDelete = async () =>{
        const ok = await confirm();

        if (ok){
            deleteMutation.mutate(undefined,{
                onSuccess: () =>{
                    onClose();
                }
            })
        }
    }

    return(
        <>
        <ConfirmDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit transactions
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing transactions
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                ?(
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="ize-4 text-muted-foreground animate-spin"/>
                    </div>
                ) :(
                    <TransactionForm 
                    id={id}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    disabled = {isPending}
                    categoryOptions = {categoryOptions}
                    onCreateCategory = {onCreateCategory}
                    accountOptions = {accountOptions}
                    onCreateAccount = {onCreateAccount}
                   />
                )
                }
              
            </SheetContent>
        </Sheet>
        </>
    );
}