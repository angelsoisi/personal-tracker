import {} from "@/components/ui/sheet";

import{
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategories } from "../api/use-edit-categories";
import { useDeleteCategory } from "../api/use-delete-categories";
import { useConfirm } from "@/hooks/use-confirm";
const formSchema = insertCategorySchema.pick({
    name:true,
})

type FormValues = z.input<typeof formSchema>;


export const EditCategorySheet = () =>{
    const {isOpen,onClose,id} = useOpenCategory();
    const [ConfirmDialog,confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this account"
    )
    const CategoryQuery = useGetCategory(id);
    const editMutation = useEditCategories(id);
    const deleteMutation = useDeleteCategory(id);
    const isPending = editMutation.isPending || deleteMutation.isPending
    const isLoading = CategoryQuery.isLoading

    const onSubmit = (values:FormValues) =>{
        editMutation.mutate(values,{
            onSuccess: () =>{
                onClose();
            }
        })
    }

    const defaultValues = CategoryQuery.data?{
        name: CategoryQuery.data.name
    }:{
        name:"",
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
                        Edit account
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing account
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                ?(
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="ize-4 text-muted-foreground animate-spin"/>
                    </div>
                ) :(
                    <CategoryForm onSubmit={onSubmit}
                    id={id}
                    disabled={isPending}
                   defaultValues={defaultValues}
                   onDelete={onDelete}
                   />
                )
                }
              
            </SheetContent>
        </Sheet>
        </>
    );
}