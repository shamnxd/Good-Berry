import { useState } from "react";
import MESSAGES from '../../../constants/messages';
import {

  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { addCategory, uploadToCloudinary } from "@/store/admin-slice";

const AddCategoryModal = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); // Control dialog open/close
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("Active");
  const { toast } = useToast();

  const handleAddCategory = async () => {
    
    const newCategory = { name: categoryName, status: categoryStatus, image: categoryImage };

    try {
      const data = await dispatch(addCategory(newCategory)).unwrap();
      setCategoryImage('');
      setPreviewImage('');

      if (data.success) {
        toast({ title: data.message });
        setCategoryName("");
        setCategoryStatus("Active");
        setIsOpen(false); // Close dialog on success
      } else {
        toast({
          title: data.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: err,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Access the first selected file
    if (!file) return; // Exit if no file is selected
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  
    // Upload to Cloudinary
    const data = await dispatch(uploadToCloudinary(file));
  
    if (!data.payload || !data.payload.url) {
      toast({
        title: MESSAGES.FAILED_TO_UPLOAD_IMAGE_PLEASE_TRY_AGAIN,
        variant: "destructive",
      });
      return;
    }
  
    const cloudinaryUrl = data.payload.url;
    setCategoryImage(cloudinaryUrl);
  };

  const isFormValid = categoryName.trim() !== "" && categoryImage;
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Enter the details for the new category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="mt-1"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-20 border p-2 h-20 rounded-md"
            />
          )}
          <Input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            aria-label="Category Name"
          />
          <div className="flex items-center space-x-2">
            <label htmlFor="category-status">Status:</label>
            <Select
              value={categoryStatus}
              onValueChange={(value) => setCategoryStatus(value)}
              id="category-status"
            >
              <SelectTrigger className="w-full px-4 py-2 border rounded">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddCategory} disabled={!isFormValid}>Add Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
