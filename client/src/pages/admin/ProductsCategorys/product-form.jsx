import { useEffect, useState } from "react";
import { X, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import MESSAGES from '../../../constants/messages';
import {

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAllCategories,
  uploadToCloudinary,
  editProduct,
  getProductDetails,
} from "@/store/admin-slice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageCropDialog from "@/components/ui/image-crop";

export default function ProductForm() {
  const { id } = useParams();
  const { categories } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState([]);
  const [packSizes, setPackSizes] = useState(["300ml", "500ml", "850ml"]);
  const [newPackSize, setNewPackSize] = useState("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCategories());

    if (id) {
      const fetchProduct = async () => {
        const result = await dispatch(getProductDetails(id));
        if (result.payload?.success) {
          const { product, variants } = result.payload;

          setName(product.name);
          setDescription(product.description);
          setSelectedCategory(product.category);
          setIsFeatured(product.isFeatured);

          // Transform and set variants
          const transformedVariants = variants.map((variant) => ({
            title: variant.title,
            description: variant.description,
            images: variant.images.map((url) => ({
              preview: url,
              cloudinaryUrl: url,
              uploading: false,
            })),
            selectedPackSizes: variant.selectedPackSizes,
            packSizePricing: variant.packSizePricing || [],
          }));

          setVariants(transformedVariants);
        }
      };

      fetchProduct();
    }
  }, [dispatch, id]);

  const availableCategories = categories.filter(
    (category) => category.status === "Active"
  );

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        images: [],
        selectedPackSizes: [],
        packSizePricing: [],
      },
    ]);
  };

  const handleUpdateVariant = (index, field, value) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[index][field] = value;
      return updatedVariants;
    });
  };

  const handleUpdatePackSizePrice = (variantIndex, packSize, field, value) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      const variant = updatedVariants[variantIndex];
  
      const existingPriceIndex = variant.packSizePricing.findIndex(
        (p) => p.size === packSize
      );
  
      if (existingPriceIndex >= 0) {
        variant.packSizePricing[existingPriceIndex][field] = value;
      } else {
        variant.packSizePricing.push({
          size: packSize,
          [field]: value,
          price: field === "price" ? value : "",
          salePrice: field === "salePrice" ? value : "",
          quantity: field === "quantity" ? value : "",
        });
      }
  
      return updatedVariants;
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePackSize = (variantIndex, size) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      const currentSizes =
        updatedVariants[variantIndex].selectedPackSizes || [];
      const isSelected = currentSizes.includes(size);

      // Remove or add the size from selectedPackSizes
      updatedVariants[variantIndex].selectedPackSizes = isSelected
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];

      // Remove pricing for unselected size
      if (isSelected) {
        updatedVariants[variantIndex].packSizePricing = updatedVariants[
          variantIndex
        ].packSizePricing.filter((p) => p.size !== size);
      }

      return updatedVariants;
    });
  };

  const handleAddPackSize = () => {
    if (newPackSize && !packSizes.includes(newPackSize)) {
      setPackSizes((prev) => [...prev, newPackSize]);
      setNewPackSize("");
    }
  };

  const handleImageUpload = async (e, variantIndex) => {
    const files = e.target.files;

    if (
      variants[variantIndex].images &&
      variants[variantIndex].images.length >= 4
    ) {
      toast({
        title: MESSAGES.YOU_CAN_ONLY_UPLOAD_MAXIMUM_4_IMAGES,
        variant: "destructive",
      });
      return;
    }

    if (files && files[0]) {
      setCurrentVariantIndex(variantIndex);
      const imageUrl = URL.createObjectURL(files[0]);
      setCurrentImage(imageUrl);
      setCropDialogOpen(true);
    }
  };

  const handleCroppedImage = async (croppedFile) => {
    try {
      const previewUrl = URL.createObjectURL(croppedFile);

      setVariants((prev) => {
        const updatedVariants = [...prev];
        updatedVariants[currentVariantIndex].images = [
          ...(updatedVariants[currentVariantIndex].images || []),
          { preview: previewUrl, uploading: true },
        ].slice(0, 4);
        return updatedVariants;
      });

      const data = await dispatch(uploadToCloudinary(croppedFile));

      if (!data.payload || !data.payload.url) {
        toast({
          title: MESSAGES.FAILED_TO_UPLOAD_IMAGE_PLEASE_TRY_AGAIN,
          variant: "destructive",
        });
        return;
      }

      const cloudinaryUrl = data.payload.url;

      setVariants((prev) => {
        const updatedVariants = [...prev];
        const currentImages = updatedVariants[currentVariantIndex].images;
        const imageIndex = currentImages.findIndex(
          (img) => img.preview === previewUrl
        );

        if (imageIndex !== -1) {
          currentImages[imageIndex] = {
            preview: cloudinaryUrl,
            uploading: false,
            cloudinaryUrl,
          };
        }

        return updatedVariants;
      });
    } catch (error) {
      console.error("Error handling cropped image:", error);
      toast({
        title: MESSAGES.FAILED_TO_PROCESS_IMAGE_PLEASE_TRY_AGAIN,
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (variantIndex, imgIndex) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].images = updatedVariants[
        variantIndex
      ].images.filter((_, i) => i !== imgIndex);
      return updatedVariants;
    });
  };

  const checkValidation = (e) => {
    e.preventDefault();

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (
        !variant.title ||
        !variant.description ||
        variant.selectedPackSizes.length === 0 ||
        variant.images.length === 0
      ) {
        toast({
          title: `Please fill in all required fields for variant ${i + 1}`,
          variant: "destructive",
        });
        return;
      }

      // Validate prices for each selected pack size
      for (const size of variant.selectedPackSizes) {
        const pricing = variant.packSizePricing.find((p) => p.size === size);
        if (!pricing || !pricing.price || !pricing.quantity) {
          toast({
            title: `Please set price and quantity for ${size} in variant ${i + 1}`,
            variant: "destructive",
          });
          return;
        }

        const price = parseFloat(pricing.price);
        const quantity = parseInt(pricing.quantity);

        if (quantity < 0) {
          toast({
            title: MESSAGES.QUANTITY_SHOULD_BE_GREATER_THAN_0,
            variant: "destructive",
          });
          return;
        }

        if (price < 0) {
          toast({
            title: MESSAGES.PRICE_SHOULD_BE_GREATER_THAN_0,
            variant: "destructive",
          });
          return;
        }
      }
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    const formData = {
      name,
      description,
      isFeatured,
      category: selectedCategory,
      variants: variants.map((variant) => ({
        title: variant.title,
        description: variant.description,
        images: variant.images
          .filter((img) => !img.uploading)
          .map((img) => img.cloudinaryUrl),
        selectedPackSizes: variant.selectedPackSizes,
        packSizePricing: variant.packSizePricing,
      })),
    };

    try {
      const action = id
        ? editProduct({ ...formData, id })
        : addProduct(formData);
      const data = await dispatch(action);

      if (data.payload?.success) {
        toast({
          title: data.payload.message,
        });
        navigate(-1);
      } else {
        toast({
          title: data.payload?.message || "Operation failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: MESSAGES.AN_ERROR_OCCURRED,
        variant: "destructive",
      });
    }
  };

  const renderPackSizePricing = (variant, variantIndex) => (
    <div className="mt-4">
      <Label>Pack Size Pricing and Quantity</Label>
      <div className="grid gap-4 mt-2">
        {variant.selectedPackSizes.map((size) => {
          const pricing = variant.packSizePricing.find((p) => p.size === size) || {};
          return (
            <div
              key={size}
              className="grid sm:grid-cols-3 gap-4 p-4 border rounded" 
            >
              <div>
                <Label>{size} - Regular Price</Label>
                <Input
                  type="number"
                  value={pricing.price || ""}
                  onChange={(e) =>
                    handleUpdatePackSizePrice(
                      variantIndex,
                      size,
                      "price",
                      e.target.value
                    )
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{size} - Sale Price</Label>
                <Input
                  type="number"
                  value={pricing.salePrice || ""}
                  onChange={(e) =>
                    handleUpdatePackSizePrice(
                      variantIndex,
                      size,
                      "salePrice",
                      e.target.value
                    )
                  }
                  className="mt-1"
                  disabled
                />
              </div>

              <div>
                <Label>{size} - Quantity</Label>
                <Input
                  type="number"
                  value={pricing.quantity || ""}
                  onChange={(e) =>
                    handleUpdatePackSizePrice(
                      variantIndex,
                      size,
                      "quantity",
                      e.target.value
                    )
                  }
                  className="mt-1"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl font-semibold mb-6">
            {id ? "Edit Product" : "Add Product"}
          </h1>

          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category" className="w-full mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="Featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
              <Label htmlFor="Featured">Featured Product</Label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-medium">
                  Variants (Flavors)
                </Label>
                <Button variant="outline" size="sm" onClick={handleAddVariant}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {variants.map((variant, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      {variant.title || `Variant ${index + 1}`}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 mx-1">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`variant-title-${index}`}>
                              Title
                            </Label>
                            <Input
                              id={`variant-title-${index}`}
                              value={variant.title}
                              onChange={(e) =>
                                handleUpdateVariant(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                          </div>

                        </div>
                        <div>
                          <Label htmlFor={`variant-description-${index}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`variant-description-${index}`}
                            value={variant.description}
                            onChange={(e) =>
                              handleUpdateVariant(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Pack Sizes</Label>
                          <div className="grid sm:grid-cols-4 gap-4 mt-2">
                            {packSizes.map((size) => (
                              <div
                                key={size}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`pack-size-${index}-${size}`}
                                  checked={variant.selectedPackSizes?.includes(
                                    size
                                  )}
                                  onCheckedChange={() =>
                                    handleTogglePackSize(index, size)
                                  }
                                />
                                <Label htmlFor={`pack-size-${index}-${size}`}>
                                  {size}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <Input
                              placeholder="Add new pack size"
                              value={newPackSize}
                              onChange={(e) => setNewPackSize(e.target.value)}
                              className="mt-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddPackSize}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        {/* Pack Size Pricing Section */}
                        {renderPackSizePricing(variant, index)}

                        <div>
                          <Label>Images (Max: 4)</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="mt-1"
                          />
                          <div className="flex space-x-2 mt-2">
                            {variant.images?.map((img, i) => (
                              <div key={i} className="relative w-20 h-20">
                                <img
                                  src={img.preview}
                                  alt="Preview"
                                  className={`object-cover w-full h-full rounded ${
                                    img.uploading ? "opacity-50" : ""
                                  }`}
                                />
                                {img.uploading && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                                  </div>
                                )}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => handleRemoveImage(index, i)}
                                  disabled={img.uploading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-4 w-[180px]"
                          onClick={() => handleRemoveVariant(index)}
                          >
                          <Trash className="w-4 h-4" />
                          Remove Variant
                        </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Button className="mt-6" onClick={checkValidation}>
                {id ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
        <ImageCropDialog
          isOpen={cropDialogOpen}
          onClose={() => {
            setCropDialogOpen(false);
            setCurrentImage(null);
          }}
          image={currentImage}
          onCropComplete={handleCroppedImage}
        />
      </div>
    </div>
  );
}
