"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {toast} from "sonner"
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-account";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeletetransactions } from "@/features/transactions/api/use-bulk-transactions";
import { useState } from "react";
import { UploadButton } from "./uploadButton";
import { ImportCard } from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreatetransactions } from "@/features/transactions/api/use-bulk-create-transactions";
enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",

}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
}
   


const TransactionsPage = () =>{
    const [AccountDialog, confirm] = useSelectAccount()
    const [variant,setVariants] = useState<VARIANTS>(VARIANTS.LIST)
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)
    const NewTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeletetransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];
    const createTransactions = useBulkCreatetransactions();


    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) =>{
        setImportResults(results)
        setVariants(VARIANTS.IMPORT)
    }

    const onCancelImport = () =>{
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariants(VARIANTS.LIST)
    }

    const isDisabled=transactionsQuery.isLoading || deleteTransactions.isPending
    const onSubmitImport = async (
        values: typeof transactionsSchema.$inferInsert[],
    ) => {
        const accountId = await confirm()

        if (!accountId){
            return toast.error("please select an account to continue")
        }

        const data = values.map((value)=>({
            ...value,
            accountId: accountId as string,
    }));

    createTransactions.mutate(data,{
        onSuccess:() =>{
            onCancelImport();
        },
    })

    };
    if (transactionsQuery.isLoading) {
        return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
            <CardHeader >
                <Skeleton className="h-8 w-48"/>
            </CardHeader>
            <CardContent>
                <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin"/>
                </div>
            </CardContent>
            </Card>
        </div>

        )
    }

    if (variant===VARIANTS.IMPORT){
        return(
            <>
            <AccountDialog/>
            <ImportCard
            data={importResults.data}
            onCancel={onCancelImport}
            onSubmit={onSubmitImport}
            />
            </>
        )
    }

    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
            Transactions History
                   </CardTitle>
                   <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                   <Button 
                   onClick={NewTransaction.onOpen} 
                   size="sm"
                   className="w-full lg:w-auto"
                   >
                    <Plus className="size-4 mr-2"/>
                    Add new
                   </Button>
                   <UploadButton onUpload = {onUpload}/>
                   </div>
                </CardHeader>
                <CardContent>
                <DataTable 
                filterKey="payee"
                columns={columns} 
                data={transactions} 
                onDelete={(row) =>{
                    const ids = row.map((r)=>r.original.id)
                    deleteTransactions.mutate({ids});
                }}
                disabled={isDisabled}
                />
                </CardContent>
            </Card>
        </div>
    )
}


export default TransactionsPage;