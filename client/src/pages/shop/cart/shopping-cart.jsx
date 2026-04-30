import { useState, useEffect } from "react";
import { Trash, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import MESSAGES from '../../../constants/messages';
import {

  removeFromCart,
  updateCartItemQuantity,
  checkQuantity,
} from "@/store/shop-slice/cart-slice";
import { applyCoupon, checkCoupon } from "@/store/shop-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CouponList from "./coupon-list";

export default function ShoppingCart() {
  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { coupon } = useSelector((state) => state.shop);
  const { items } = useSelector(
    (state) => state.cart
  );

  const couponDiscount = coupon?.discount || 0;

  const clearCoupon = () => {
    setCouponCode("");
    dispatch({ type: "shop/applyCoupon/fulfilled", payload: {} });
  };

  const getAvailableQuantity = (item) => {
    return (
      availableQuantities[
        `${item.productId}-${item.packageSize}-${item.flavor}`
      ] || 0
    );
  };

  const inStockItems = items.filter(
    (item) => getAvailableQuantity(item) > 0 && item.quantity <= getAvailableQuantity(item)
  );
  const outOfStockItems = items.filter(
    (item) => getAvailableQuantity(item) === 0 || item.quantity > getAvailableQuantity(item)
  );

  useEffect(() => {
    const activeItems = inStockItems;
    const newSubtotal = activeItems.reduce(
      (sum, item) => sum + item?.price * item?.quantity,
      0
    );
    const discount =
      newSubtotal -
      activeItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    setDiscount(discount);
    setSubtotal(newSubtotal);

    const subtotalAfterDiscount = newSubtotal - discount;
    setTotalAfterDiscount(subtotalAfterDiscount);
    setTotal(subtotalAfterDiscount - (coupon?.discount || 0));

    if (coupon?.discount && subtotalAfterDiscount < 1000) {
      clearCoupon();
      toast({
        title: MESSAGES.COUPON_REMOVED,
        description: MESSAGES.CART_TOTAL_AFTER_DISCOUNT_IS_BELOW_THE_MINIMUM_REQUIRED_AMOUNT,
        variant: "destructive",
      });
    }
  }, [items, coupon, availableQuantities]);

  useEffect(() => {
    if (couponCode && !coupon.discount) {
      dispatch(checkCoupon({ code: couponCode, total: totalAfterDiscount }));
    }
  }, [dispatch, couponCode, totalAfterDiscount]);

  useEffect(() => {
    const fetchAllQuantities = async () => {
      try {
        const response = await dispatch(
          checkQuantity(
            items.map((item) => ({
              productId: item.productId,
              packageSize: item.packageSize,
              flavor: item.flavor,
            }))
          )
        ).unwrap();

        const quantities = {};
        const data = response.data;
        data.forEach((res) => {
          if (!res.error) {
            quantities[`${res.productId}-${res.packageSize}-${res.flavor}`] =
              res.availableQuantity ?? res.quantity ?? 0;
          }
        });
        setAvailableQuantities(quantities);
      } catch (error) {
        console.error("Error fetching quantities:", error);
      }
    };

    if (items.length > 0) {
      fetchAllQuantities();
    }
  }, [items, dispatch]);



  const handleQuantityChange = async (
    productId,
    currentQuantity,
    packageSize,
    flavor,
    action,
    forcedValue = null
  ) => {
    const newQuantity = forcedValue !== null ? forcedValue :
      action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    const availableQuantity = getAvailableQuantity({
      productId,
      packageSize,
      flavor,
    });

    if (newQuantity <= 0) return;

    if (newQuantity > 5) {
      toast({
        title: MESSAGES.QUANTITY_LIMIT_REACHED,
        description: MESSAGES.YOU_CAN_ONLY_ADD_A_MAXIMUM_OF_5_ITEMS_TO_THE_CART,
      });
      return;
    }

    if (newQuantity > availableQuantity) {
      toast({
        title: MESSAGES.QUANTITY_LIMIT_REACHED,
        description: `Only ${availableQuantity} items are available in stock.`,
      });
      return;
    }

    try {
      await dispatch(
        updateCartItemQuantity({
          itemId: productId,
          packageSize,
          flavor,
          quantity: newQuantity,
        })
      ).unwrap();
    } catch (err) {
      toast({
        title: MESSAGES.UPDATE_FAILED,
        description: typeof err === 'string' ? err : "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (productId, packageSize, flavor) => {
    await dispatch(
      removeFromCart({
        itemId: productId,
        packageSize,
        flavor,
      })
    );
    const remainingItems = items.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.packageSize === packageSize &&
          item.flavor === flavor
        )
    );
    const newSubtotal = remainingItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newDiscount =
      newSubtotal -
      remainingItems.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
      );
    const newTotalAfterDiscount = newSubtotal - newDiscount;

    if (remainingItems.length === 0 || newTotalAfterDiscount < 1000) {
      clearCoupon();
      if (newTotalAfterDiscount < 1000 && remainingItems.length > 0) {
        toast({
          title: MESSAGES.COUPON_REMOVED,
          description: MESSAGES.CART_TOTAL_AFTER_DISCOUNT_IS_BELOW_THE_MINIMUM_REQUIRED_AMOUNT,
          variant: "destructive",
        });
      }
    }
  };

  const handleApplyCoupon = async (code = couponCode) => {
    try {
      const response = await dispatch(
        applyCoupon({ code, total: totalAfterDiscount })
      ).unwrap();
      if (response.success) {
        toast({
          title: MESSAGES.COUPON_APPLIED_SUCCESSFULLY,
          description: response.message,
        });
        setCouponCode(code);
      } else {
        toast({
          title: MESSAGES.ERROR_APPLYING_COUPON,
          description: response.message,
          variant: "destructive",
        });
        setCouponCode("");
      }
    } catch (error) {
      toast({
        title: MESSAGES.ERROR_APPLYING_COUPON,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveInactiveItems = async () => {
    const inactiveItems = items.filter(
      (item) => getAvailableQuantity(item) === 0 || item.quantity > getAvailableQuantity(item)
    );
    
    for (const item of inactiveItems) {
      await dispatch(
        removeFromCart({
          itemId: item.productId,
          packageSize: item.packageSize,
          flavor: item.flavor,
        })
      );
    }
    
    toast({
      title: MESSAGES.CART_UPDATED,
      description: MESSAGES.INVALID_ITEMS_HAVE_BEEN_REMOVED_FROM_YOUR_CART,
    });
  };

  const hasIssues = items.some(
    (item) => getAvailableQuantity(item) === 0 || item.quantity > getAvailableQuantity(item)
  );

  return (
    <div className="container mx-auto max-w-[1400px] py-4 px-4 min-h-[80vh]">
      <h2 className="text-xl px-3 lg:px-0 font-bold mb-6">Your cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-6">
           {inStockItems.length === 0 && outOfStockItems.length === 0 ? (
            <p className="italic text-muted-foreground">No items in cart</p>
          ) : (
            <div className="space-y-2">
              {inStockItems.map((item) => (
                <Card
                  key={`${item.productId}-${item.packageSize}-${item.flavor}`}
                  className="w-full border-none shadow-sm rounded-xl overflow-hidden"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      {/* Product Info */}
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => navigate(`/shop/product/${item.productId}`)}
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden group">
                          <img
                            src={item?.image || "/placeholder.svg"}
                            alt={item?.name}
                            className="h-full w-full object-contain p-1 transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate hover:text-[#8CC63F] transition-colors">{item?.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item?.flavor} • {item.packageSize}
                          </p>
                          <div className="mt-1 font-bold text-[#8CC63F] sm:hidden">
                            ₹{item?.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Controls & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:mt-0 sm:pt-0 sm:border-0 border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center rounded-lg border bg-gray-50/50">
                            <button
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity,
                                  item.packageSize,
                                  item.flavor,
                                  "decrease"
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item?.quantity}</span>
                            <button
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity,
                                  item.packageSize,
                                  item.flavor,
                                  "increase"
                                )
                              }
                              disabled={
                                item.quantity >= getAvailableQuantity(item) ||
                                item.quantity >= 5
                              }
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="hidden sm:block text-right min-w-[100px]">
                            <div className="text-sm font-bold text-[#8CC63F]">
                              ₹{item?.price.toFixed(2)}
                            </div>
                            <span className="text-[10px] text-muted-foreground">per unit</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() =>
                            handleRemoveItem(
                              item.productId,
                              item.packageSize,
                              item.flavor
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {outOfStockItems.length > 0 && (
                <div className="mt-8 pt-3 px-4 lg:px-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-red-500">
                        Unavailable Items
                      </h3>
                      <p className="text-xs text-muted-foreground">These items won't be included in your checkout</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-red-500 hover:bg-red-50 border-red-100"
                      onClick={handleRemoveInactiveItems}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {outOfStockItems.map((item) => (
                      <Card
                        key={`${item.productId}-${item.packageSize}-${item.flavor}`}
                        className="w-full border-none shadow-sm rounded-xl"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="h-16 w-16 bg-gray-50 rounded-lg flex-shrink-0">
                                <img
                                  src={item?.image || "/placeholder.svg"}
                                  alt={item?.name}
                                  className="h-full w-full object-contain p-1 grayscale"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-medium">{item?.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {item?.flavor} • {item.packageSize}
                                </p>
                                
                                {getAvailableQuantity(item) === 0 ? (
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-[12px] font-bold text-red-500">
                                      Out of Stock
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-[12px] font-bold text-yellow-600">
                                      Only {getAvailableQuantity(item)} available
                                    </span>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-7 text-[10px] border-[#8CC63F] text-[#8CC63F] hover:bg-[#8CC63F] hover:text-white px-3"
                                      onClick={() => handleQuantityChange(
                                        item.productId, 
                                        item.quantity, 
                                        item.packageSize, 
                                        item.flavor, 
                                        "set", 
                                        getAvailableQuantity(item)
                                      )}
                                    >
                                      Update to {getAvailableQuantity(item)}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:pt-0">
                              <span className="text-sm font-bold text-gray-500">
                                ₹{item?.price.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.productId,
                                    item.packageSize,
                                    item.flavor
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 !rounded-none border-none shadow-none overflow-hidden">
            <CardHeader className="pb-0 px-4">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 !px-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Promo Code
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="ENTER CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="uppercase bg-white border-gray-200 h-10 pr-10"
                      disabled={coupon.discount}
                    />
                    <CouponList onSelectCoupon={setCouponCode} />
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#8AB446] text-[#8AB446] hover:bg-[#8AB446] hover:text-white transition-all h-10"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode || coupon.discount}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product Discount</span>
                  <span className="text-green-600 font-semibold">-₹{discount?.toFixed(2)}</span>
                </div>

                {coupon.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        Applied
                      </span>
                    </div>
                    <span className="text-green-600 font-semibold">-₹{couponDiscount?.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm pb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-400 italic">Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-black text-[#8AB446]">₹{total?.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#8AB446] hover:bg-[#8AB446]/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-[#8AB446]/20 transition-all active:scale-[0.98]"
                onClick={() => navigate("/shop/cart/checkout")}
                disabled={inStockItems.length === 0}
              >
                Checkout Now ({inStockItems.length})
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#8AB446]" />
                Secure checkout powered by Stripe & Razorpay
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
