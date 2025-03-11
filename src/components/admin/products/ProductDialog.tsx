
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "./ProductForm";
import { ProductFormValues, Product } from "@/types/product";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onOpenProductDialog: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const ProductDialog = ({ 
  isOpen, 
  onOpenChange, 
  editingProduct, 
  onOpenProductDialog, 
  onSubmit 
}: ProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onOpenProductDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your product
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          editingProduct={editingProduct} 
          onSubmit={onSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
