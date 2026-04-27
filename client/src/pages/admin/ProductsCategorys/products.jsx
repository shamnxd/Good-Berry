import { useEffect, useState, useCallback, useRef } from "react";
import MESSAGES from '../../../constants/messages';
import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, unlistProduct } from "@/store/admin-slice";
import {
  addProductOffer,
  removeProductOffer,
} from "@/store/admin-slice/offer-slice";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"; // Import Badge component

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading, totalPages, currentPage } = useSelector(
    (state) => state.admin
  );

  const searchInputRef = useRef(null);
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [itemsPerPage] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offerPercentage, setOfferPercentage] = useState(0);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isUnlistDialogOpen, setIsUnlistDialogOpen] = useState(false);

  const loadProducts = useCallback(
    (page = 1) => {
      dispatch(
        fetchProducts({
          page,
          limit: itemsPerPage,
          search: debouncedSearch,
        })
      );
    },
    [dispatch, debouncedSearch, itemsPerPage]
  );

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    loadProducts(1);
  }, [debouncedSearch, loadProducts]);

  const handleUnlist = async () => {
    if (selectedProduct) {
      const data = await dispatch(unlistProduct(selectedProduct._id));

      if (data.payload.success) {
        toast({
          title: MESSAGES.SUCCESS,
          description: data.payload.message,
        });
        loadProducts(currentPage);
      } else {
        toast({
          title: MESSAGES.ERROR,
          description: data.payload.message || "Failed to update product status",
          variant: "destructive",
        });
      }
      setSelectedProduct(null);
      setIsUnlistDialogOpen(false);
    }
  };

  const handleAddOffer = async () => {
    if (selectedProduct) {
      const data = await dispatch(
        addProductOffer({ productId: selectedProduct._id, offerPercentage })
      );

      if (data.payload.success) {
        toast({
          title: MESSAGES.SUCCESS,
          description: data.payload.message,
        });
        loadProducts(currentPage);
      } else {
        toast({
          title: MESSAGES.ERROR,
          description: data.payload.message || "Failed to add offer",
          variant: "destructive",
        });
      }
      setSelectedProduct(null);
      setIsOfferDialogOpen(false);
    }
  };

  const handleRemoveOffer = async () => {
    if (selectedProduct) {
      const data = await dispatch(
        removeProductOffer({ productId: selectedProduct._id })
      );

      if (data.payload.success) {
        toast({
          title: MESSAGES.SUCCESS,
          description: data.payload.message,
        });
        loadProducts(currentPage);
      } else {
        toast({
          title: MESSAGES.ERROR,
          description: data.payload.message || "Failed to remove offer",
          variant: "destructive",
        });
      }
      setSelectedProduct(null);
      setIsOfferDialogOpen(false);
    }
  };

  const handlePageChange = (newPage) => {
    loadProducts(newPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-sm pb-2">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="pl-8 pr-4 py-2 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={20} />
              </Button>
              <Button onClick={() => navigate("/admin/products/add")}>
                Add Product
              </Button>
            </div>
          </div>
        </div>
        <div
          className="border rounded-lg mx-4 mb-4"
          style={{ height: "400px", overflowY: "auto" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>List/Unlist</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || ""}
                        alt={product.name || "Product Image"}
                        className="h-12 w-12 rounded-lg border p-1"
                      />
                      <span>{product.name || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5">
                    ₹{product.price || 0}
                  </TableCell>
                  <TableCell className="px-5">
                    {product.variantCount || 0}
                  </TableCell>
                  <TableCell className="px-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.totalStock < 1
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {product.totalStock || 0}
                    </span>
                  </TableCell>
                  <TableCell className="px-5">
                    {product.category.name || "N/A"}
                  </TableCell>
                  <TableCell className="pl-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.unListed
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {product.unListed ? "Unlisted" : "Listed"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5">
                    {product.offerPercentage > 0 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        {product.offerPercentage}%
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        No Offer
                      </Badge>
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
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsUnlistDialogOpen(true);
                          }}
                          className={
                            product.unListed ? "text-green-500" : "text-red-500"
                          }
                        >
                          {product.unListed ? "List" : "Unlist"}
                        </DropdownMenuItem>
                        {product.offerPercentage > 0 ? (
                          <DropdownMenuItem
                          className="text-red-600"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsOfferDialogOpen(true);
                            }}
                          >
                            Remove Offer
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                          className="text-green-600"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsOfferDialogOpen(true);
                            }}
                          >
                            Add Offer
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
      </div>

      {selectedProduct && isOfferDialogOpen && (
        <Dialog
          open={isOfferDialogOpen}
          onOpenChange={() => setIsOfferDialogOpen(false)}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">
                {selectedProduct.offerPercentage > 0
                  ? "Remove Offer"
                  : "Add Offer"}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct.offerPercentage > 0 ? (
                  <>
                    Are you sure you want to remove the offer from this product?
                    <DialogFooter className={"mt-5"}>
                      <Button
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        No, keep it
                      </Button>
                      <Button varient="primary" onClick={handleRemoveOffer}>
                        Yes, remove offer
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <p className="mb-5 text-md">Enter the offer percentage for this product:</p>
                    <Input
                      type="number"
                      placeholder="Enter offer percentage"
                      value={offerPercentage}
                      onChange={(e) => setOfferPercentage(e.target.value)}
                    />
                    <DialogFooter className={"mt-7"}>
                      <Button
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        No, keep it
                      </Button>
                      <Button varient="primary" onClick={handleAddOffer}>
                        Yes, add offer
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {selectedProduct && isUnlistDialogOpen && (
        <Dialog
          open={isUnlistDialogOpen}
          onOpenChange={() => setIsUnlistDialogOpen(false)}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {selectedProduct.unListed ? "list" : "unlist"} this product?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUnlistDialogOpen(false)}
              >
                No, keep it
              </Button>
              <Button varient="primary" onClick={handleUnlist}>
                Yes,
                {selectedProduct.unListed ? " list" : " unlist"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
