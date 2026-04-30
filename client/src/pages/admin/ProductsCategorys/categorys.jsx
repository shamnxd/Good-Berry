import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "@/store/admin-slice";
import { addCategoryOffer, removeCategoryOffer } from "@/store/admin-slice/offer-slice";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, PlusCircle, Trash } from "lucide-react";
import MESSAGES from '../../../constants/messages';
import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCategoryModal from "./edit-category";
import AddCategoryModal from "./add-category";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function Categorys() {
  const { categories, totalPages, currentPage } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemsPerPage] = useState(5);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isRemoveOfferDialogOpen, setIsRemoveOfferDialogOpen] = useState(false);
  const [offerCategory, setOfferCategory] = useState(null);
  const [offerPercentage, setOfferPercentage] = useState('');

  const loadCategories = useCallback(
    (page = 1) => {
      dispatch(
        getAllCategories({
          page,
          limit: itemsPerPage,
        })
      );
    },
    [dispatch, itemsPerPage]
  );

  const handlePageChange = (newPage) => {
    loadCategories(newPage);
  };

  useEffect(() => {
    loadCategories(1);
  }, [loadCategories]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleAddOffer = (category) => {
    setOfferCategory(category);
    setIsOfferDialogOpen(true);
  };

  const confirmAddOffer = async () => {
    if (offerPercentage) {
      const data = await dispatch(addCategoryOffer({ categoryId: offerCategory._id, offerPercentage: parseInt(offerPercentage) }));
      if (data.payload.success) {
        toast({ title: MESSAGES.SUCCESS, description: data.payload.message });
        loadCategories(currentPage);
      } else {
        toast({
          title: MESSAGES.ERROR,
          description: data.payload.message || "Failed to add offer",
          variant: "destructive",
        });
      }
      setIsOfferDialogOpen(false);
      setOfferPercentage('');
    }
  };

  const handleRemoveOffer = (category) => {
    setOfferCategory(category);
    setIsRemoveOfferDialogOpen(true);
  };

  const confirmRemoveOffer = async () => {
    const data = await dispatch(removeCategoryOffer({ categoryId: offerCategory._id }));
    if (data.payload.success) {
      toast({ title: MESSAGES.SUCCESS, description: data.payload.message });
      loadCategories(currentPage);
    } else {
      toast({
        title: MESSAGES.ERROR,
        description: data.payload.message || "Failed to remove offer",
        variant: "destructive",
      });
    }
    setIsRemoveOfferDialogOpen(false);
  };

  return (
    <div className="rounded-lg shadow-sm bg-white pb-4 lg:m-8 lg:mt-4 lg:ml-3">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <AddCategoryModal />
        </div>
      </div>
      <div className="border rounded-lg mx-4 mb-4" style={{ height: "450px" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>List/Unlist</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 rounded-lg border p-1"
                    />
                    <span>{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch checked={category.status === "Active"} />
                </TableCell>
                <TableCell>
                  {category.offerPercentage > 0 ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{category.offerPercentage}%</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">No Offer</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          handleEditClick(category);
                        }}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {category.offerPercentage > 0 ? (
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleRemoveOffer(category)}
                        >
                         <Trash className="h-4 w-4" /> Remove Offer
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => handleAddOffer(category)}
                        >
                          <PlusCircle className="h-4 w-4"/> Add Offer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-5 mr-4 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isEditModalOpen && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isOfferDialogOpen && (
        <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Offer</DialogTitle>
              <DialogDescription>
                Enter the offer percentage you want to add to this category.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="offerPercentage" className="text-right">Offer Percentage</label>
                <Input
                  id="offerPercentage"
                  value={offerPercentage}
                  onChange={(e) => setOfferPercentage(e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAddOffer}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isRemoveOfferDialogOpen && (
        <Dialog open={isRemoveOfferDialogOpen} onOpenChange={setIsRemoveOfferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Offer</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove the offer from this category? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRemoveOfferDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmRemoveOffer}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Categorys;
