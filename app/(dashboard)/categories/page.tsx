"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { categories } from "@/db/schema";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeletecategories } from "@/features/categories/api/use-bulk-delete-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
   


const CategoriesPage = () =>{
    const newCategory = useNewCategory();
    const useDeleteCategory = useBulkDeletecategories();
    const CategoryQuery = useGetCategories();
    const categories = CategoryQuery.data || [];

    const isDisabled=CategoryQuery.isLoading || useDeleteCategory.isPending

    if (CategoryQuery.isLoading) {
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


    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
            Cate Page
                   </CardTitle>
                   <Button onClick={newCategory.onOpen} size="sm">
                    <Plus className="size-4 mr-2"/>
                    Add new
                   </Button>
                </CardHeader>
                <CardContent>
                <DataTable 
                filterKey="name"
                columns={columns} 
                data={categories} 
                onDelete={(row) =>{
                    const ids = row.map((r)=>r.original.id)
                    useDeleteCategory.mutate({ids});
                }}
                disabled={isDisabled}
                />
                </CardContent>
            </Card>
        </div>
    )
}


export default CategoriesPage;