"use client";

import { NewAccountSheet } from "@/features/accounts/components/new-account";
import { useMountedState } from "react-use";
import { EditAccountSheet } from "@/features/accounts/components/edit-account";
import { NewCategorySheet } from "@/features/categories/components/new-category";
import { EditCategorySheet } from "@/features/categories/components/edit-category";
import { NewTransaction } from "@/features/transactions/components/new-transaction";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction";
export const SheetProvider = () =>{
    const isMounted = useMountedState();
    
    if (!isMounted) return null;

    return(
        <>
        <NewAccountSheet/>
        <EditAccountSheet/>
        <NewCategorySheet/>
        <EditCategorySheet/>
        <NewTransaction/>
        <EditTransactionSheet/>
        </>
    );
};