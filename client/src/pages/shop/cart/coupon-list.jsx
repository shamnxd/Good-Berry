import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { getCoupons } from "@/store/shop-slice/cart-slice";
import { Ticket } from "lucide-react";

export default function CouponList({ onSelectCoupon }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (open) {
      dispatch(getCoupons());
    }
  }, [dispatch, open]);

  const handleCouponSelect = (couponCode) => {
    onSelectCoupon(couponCode || "");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[#8AB446] !mt-3 hover:underline text-sm font-medium flex items-center gap-1 transition-all">
          See Offers
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[400px] rounded-lg p-0 border-none shadow-xl">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="text-base font-semibold">Available Offers</DialogTitle>
        </DialogHeader>

        <div className="p-2 space-y-0 max-h-[50vh] overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
              Checking for available offers...
            </div>
          ) : coupons?.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[13px] bg-gray-100 text-gray-900 px-2 py-0.5 rounded border border-gray-200 uppercase">
                      {coupon.code}
                    </span>
                    <span className="text-[11px] font-bold text-[#8AB446]">
                      ₹{coupon?.discount || 0} OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-1">
                    {coupon.description || "Valid on this order"}
                  </p>
                </div>
                <button
                  className="text-xs font-bold text-[#8AB446] hover:text-[#7fb22e] px-2 py-1 transition-colors uppercase tracking-tight"
                  onClick={() => handleCouponSelect(coupon.code)}
                >
                  Apply
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              No coupons currently available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

