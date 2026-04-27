import { useState } from "react";
import MESSAGES from '../../../constants/messages';
import {

  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { updateCategory, uploadToCloudinary } from "@/store/admin-slice";
import PropTypes from "prop-types";

const EditCategoryModal = ({ category, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(category?.name || "");
  const [status, setStatus] = useState(category?.status || "");
  const [categoryImage, setCategoryImage] = useState(category?.image || "");
  const [previewImage, setPreviewImage] = useState(category?.image || "");
  const [uploading , setUploading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await dispatch(updateCategory({ id: category._id, name: name.trim(), status, image: categoryImage })).unwrap();

      if (data.success) {
        toast({ title: data.message });
        onClose(); 
      } else {
        toast({
          title: data.message || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: err.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Access the first selected file
    if (!file) return; // Exit if no file is selected

    setUploading(true);    
    setCategoryImage(null); // Clear previous image URL if uploading a new one
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
    setUploading(false);
  };
  

    const isFormValid = name.trim() !== "" && categoryImage;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details for the category below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="mt-1"
          />
          {previewImage && (
            <div className="relative w-20 h-20">
              <img
                src={previewImage}
                alt="Preview"
                className={`w-20 border p-2 h-20 rounded-md ${uploading ? "opacity-50" : ""}`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                </div>
              )}
            </div>
          )}
          <Input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Category Name"
          />
          <div className="flex items-center space-x-2">
            <label htmlFor="category-status">Status:</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

EditCategoryModal.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditCategoryModal;
