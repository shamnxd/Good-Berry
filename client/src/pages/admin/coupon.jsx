import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import MESSAGES from '../../constants/messages';
import {

  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCoupons, addCoupon, updateCoupon, deleteCoupon } from "@/store/admin-slice/coupon-slice";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import PropTypes from "prop-types";

export default function CouponManagement() {
  const dispatch = useDispatch();
  const { coupons, totalPages, currentPage } = useSelector(state => state.coupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1, search, status: statusFilter }));
  }, [dispatch, search, statusFilter]);

  const handleAddCoupon = (newCoupon) => {
    dispatch(addCoupon(newCoupon))
      .then((response) => {
        console.error("Error adding coupon:", response);
        if (response.payload) {
          toast({
            title: MESSAGES.SUCCESS,
            description: MESSAGES.COUPON_ADDED_SUCCESSFULLY
          });
          setIsDialogOpen(false);
        } else {
          toast({
            title: MESSAGES.ERROR,
            description: MESSAGES.COUPON_CODE_ALREADY_EXISTS,
            variant: "destructive"
          });
        }
      })
      .catch((error) => {
        console.error("Error adding coupon: err", error);
        toast({ 
          title: MESSAGES.ERROR,
          description: error.message,
          variant: "destructive"
        });
      });
  };

  const handleEditCoupon = (editedCoupon) => {
    dispatch(updateCoupon({ id: editedCoupon._id, couponData: editedCoupon }))
      .then((response) => {
        if (response.payload) {
          toast({
            title: MESSAGES.SUCCESS,
            description: MESSAGES.COUPON_UPDATED_SUCCESSFULLY,
          });
          setIsDialogOpen(false);
          setEditingCoupon(null);
        } else {
          toast({
            title: MESSAGES.ERROR,
            description: MESSAGES.COUPON_CODE_ALREADY_EXISTS,
            variant: "destructive"
          });
        }
      })
      .catch((error) => {
        toast({
          title: MESSAGES.ERROR,
          description: error.message,
          variant: "destructive"
        });
      });
  };

  const handleDeleteCoupon = (id) => {
    dispatch(deleteCoupon(id))
      .then(() => {
        toast({
          title: MESSAGES.SUCCESS,
          description: MESSAGES.COUPON_DELETED_SUCCESSFULLY
        });
        setIsRemoveDialogOpen(false);
        setSelectedCoupon(null);
      })
      .catch((error) => {
        toast({
          title: MESSAGES.ERROR,
          description: error.message,
          variant: "destructive"
        });
      });
  };

  if (!coupons?.length) return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">No Coupons Found</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCoupon(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm onSubmit={handleAddCoupon} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search by Coupon ID or Code" 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCoupon(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
              </DialogHeader>
              <CouponForm 
                onSubmit={editingCoupon ? handleEditCoupon : handleAddCoupon} 
                initialData={editingCoupon}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div className="md:col-span-2">
                <div className="font-medium text-sm text-gray-500">Coupon Code</div>
                <div className="font-medium">{coupon.code}</div>
                <div className="mt-2">
                  <div className="font-medium text-sm text-gray-500">Valid Period</div>
                  <div className="text-sm">
                    {format(new Date(coupon.startDate), "LLL dd, y")} - {format(new Date(coupon.endDate), "LLL dd, y")}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Discount</div>
                <div>₹{coupon.discount.toFixed(2)}</div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Usage</div>
                <div>{coupon.used} / {coupon.usageLimit}</div>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-500">Status</div>
                <Badge 
                  variant={
                    coupon.status === 'active' ? 'success' : 
                    coupon.status === 'expired' ? 'destructive' : 'secondary'
                  }
                  className="mt-1"
                >
                  {coupon.status}
                </Badge>
              </div>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        if (coupon.status !== 'expired') {
                          setEditingCoupon(coupon);
                          setIsDialogOpen(true);
                        }
                      }}
                      disabled={coupon.status === 'expired'}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setIsRemoveDialogOpen(true);
                        setSelectedCoupon(coupon._id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && <div className="mt-4 flex items-center justify-between max-w-[300px]">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => dispatch(fetchCoupons({ page: currentPage - 1, search, status: statusFilter }))}
        >
          Previous
        </Button>
        <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages}
          onClick={() => dispatch(fetchCoupons({ page: currentPage + 1, search, status: statusFilter }))}
        >
          Next
        </Button>
      </div>}

      {selectedCoupon && (
        <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-3">Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this coupon?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                No, keep it
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteCoupon(selectedCoupon)}>
                Yes, Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CouponForm({ onSubmit, initialData }) {
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
    defaultValues: initialData ? {
      ...initialData,
      dateRange: initialData.startDate && initialData.endDate ? {
        from: new Date(initialData.startDate),
        to: new Date(initialData.endDate)
      } : {
        from: undefined,
        to: undefined
      }
    } : {
      code: "",
      description: "",
      discount: "",
      dateRange: {
        from: undefined,
        to: undefined
      },
      usageLimit: "",
      minimumAmount: "",
      status: "active"
    },
    mode: "onChange"
  });

  const onSubmitForm = (data) => {
    const formattedData = {
      ...data,
      startDate: data.dateRange?.from ? new Date(data.dateRange.from).toISOString().split('T')[0] : null,
      endDate: data.dateRange?.to ? new Date(data.dateRange.to).toISOString().split('T')[0] : null
    };
    
    delete formattedData.dateRange;
    
    if (initialData) {
      formattedData._id = initialData._id;
    }
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="code">Coupon Code</Label>
        <Input 
          id="code" 
          {...register("code", { required: "Coupon code is required" })} 
          className="mt-1" 
        />
        {errors.code && <span className="text-red-600 text-sm">{errors.code.message}</span>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          {...register("description", { required: "Description is required" })} 
          className="mt-1" 
        />
        {errors.description && <span className="text-red-600 text-sm">{errors.description.message}</span>}
      </div>
      
      <div className="flex gap-3 w-full">
        <div className="w-full">
          <Label htmlFor="discount">Discount Amount (₹)</Label>
          <Input 
            id="discount" 
            type="number" 
            step="0.01" 
            {...register("discount", { 
              required: "Discount amount is required",
              min: { value: 0, message: MESSAGES.DISCOUNT_MUST_BE_POSITIVE }
            })} 
            className="mt-1" 
          />
          {errors.discount && <span className="text-red-600 text-sm">{errors.discount.message}</span>}
        </div>
        <div className="w-full">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} defaultValue={"active"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <span className="text-red-600 text-sm">{errors.status.message}</span>}
        </div>
      </div>

      <div className="w-full">
        <Label htmlFor="dateRange">Valid Period</Label>
        <Controller
          name="dateRange"
          control={control}
          rules={{ required: "Date range is required" }}
          render={({ field }) => (
            <DatePickerWithRange 
              value={field.value}
              onValueChange={field.onChange}
              className="mt-1"
            />
          )}
        />
        {errors.dateRange && <span className="text-red-600 text-sm">{errors.dateRange.message}</span>}
      </div>

      <div className="flex gap-3 w-full">
        <div className="w-full">
          <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input 
            id="usageLimit" 
            type="number" 
            {...register("usageLimit", { 
              required: "Usage limit is required",
              min: { value: 1, message: MESSAGES.USAGE_LIMIT_MUST_BE_AT_LEAST_1 }
            })} 
            className="mt-1" 
          />
          {errors.usageLimit && <span className="text-red-600 text-sm">{errors.usageLimit.message}</span>}
        </div>
        <div className="w-full">
          <Label htmlFor="minimumAmount">Minimum Amount (₹)</Label>
          <Input 
            id="minimumAmount" 
            type="number" 
            step="0.01" 
            {...register("minimumAmount", { 
              required: "Minimum amount is required",
              min: { value: 0, message: MESSAGES.MINIMUM_AMOUNT_CANNOT_BE_NEGATIVE }
            })} 
            className="mt-1" 
          />
          {errors.minimumAmount && <span className="text-red-600 text-sm">{errors.minimumAmount.message}</span>}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid}
      >
        {initialData ? "Update Coupon" : "Add Coupon"}
      </Button>
    </form>
  );
}


CouponForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    code: PropTypes.string,
    description: PropTypes.string,
    discount: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    usageLimit: PropTypes.number,
    minimumAmount: PropTypes.number,
    status: PropTypes.oneOf(["active", "inactive", "expired"])
  })
};