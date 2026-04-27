import { Button } from "@/components/ui/button";
import MESSAGES from '../../../constants/messages';
import {

  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  removeFromCart,
  updateCartItemQuantity,
  checkQuantity,
} from "@/store/shop-slice/cart-slice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CartSidebar = ({ isCartOpen, setIsCartOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, quantityLoading } = useSelector((state) => state.cart);
  const { toast } = useToast();
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isCartOpen) {
      setAnimationClass("cart-enter");
    } else {
      setAnimationClass("cart-exit");
    }
  }, [isCartOpen]);

  const getItemId = (productId) => {
    return typeof productId === 'object' ? productId._id : productId;
  };

  useEffect(() => {
    const fetchAllQuantities = async () => {
      try {
        const response = await dispatch(
          checkQuantity(
            items.map((item) => ({
              productId: getItemId(item.productId),
              packageSize: item.packageSize,
              flavor: item.flavor,
            }))
          )
        ).unwrap();

        const quantities = {};
        const data = response.data;
        data.forEach((res) => {
          if (!res.error) {
            const resId = getItemId(res.productId);
            quantities[`${resId}-${res.packageSize}-${res.flavor}`] =
              res.quantity;
          }
        });
        setAvailableQuantities(quantities);
      } catch (error) {
        console.error("Error fetching quantities:", error);
      }
    };

    if (isCartOpen && items && items.length > 0) {
      fetchAllQuantities();
    }
  }, [isCartOpen, items, dispatch]);

  const getAvailableQuantity = (item) => {
    const itemId = getItemId(item.productId);
    return (
      availableQuantities[
        `${itemId}-${item.packageSize}-${item.flavor}`
      ] || 0
    );
  };

  const handleQuantityChange = async (item, action, forcedValue = null) => {
    const currentQuantity = item.quantity;
    const newQuantity = forcedValue !== null ? forcedValue :
      action === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    const availableQuantity = getAvailableQuantity(item);

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
          itemId: item.productId,
          packageSize: item.packageSize,
          flavor: item.flavor,
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
    if (items.length === 1) {
      setIsCartOpen(false);
    }
  };

  const inStockItems = items.filter(
    (item) => getAvailableQuantity(item) > 0 && item.quantity <= getAvailableQuantity(item)
  );
  const outOfStockItems = items.filter(
    (item) => getAvailableQuantity(item) === 0 || item.quantity > getAvailableQuantity(item)
  );

  const calculateTotals = () => {
    const subtotal = inStockItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount =
      subtotal -
      inStockItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    return {
      subtotal,
      discount: discount,
      total: subtotal - discount,
    };
  };

  const { subtotal, discount, total } = calculateTotals();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-sm transition-all ${animationClass} flex flex-col`}
      >
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-grow mt-8">
          {items.length > 0 ? (
            <div className="flex flex-col space-y-6">
              {/* Available Items */}
              {inStockItems.length > 0 && (
                <div className="space-y-4">
                  {inStockItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.packageSize}-${item.flavor}`}
                      className="flex flex-col space-y-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-16 w-16 rounded-md border bg-white p-1">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.productId,
                                  item.packageSize,
                                  item.flavor
                                )
                              }
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4 !text-gray-800" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.flavor}{" "}
                            {item.packageSize && `- ${item.packageSize}`}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-medium text-[#8CC63F]">
                              ₹{item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center rounded-lg border bg-gray-50/50 scale-90 origin-right">
                                    <button
                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                                        onClick={() => handleQuantityChange(item, "decrease")}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                                    <button
                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                                        onClick={() => handleQuantityChange(item, "increase")}
                                        disabled={
                                            item.quantity >= getAvailableQuantity(item) ||
                                            item.quantity >= 5
                                        }
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Unavailable Items */}
              {outOfStockItems.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="text-[13px] font-bold text-red-500">
                    Currently Unavailable
                  </h4>
                  {outOfStockItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.packageSize}-${item.flavor}`}
                      className="flex flex-col space-y-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-14 w-14 rounded-md border bg-gray-50 p-1 grayscale">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-xs line-clamp-1">{item.name}</h3>
                            <button
                              onClick={() =>
                                handleRemoveItem(
                                  item.productId,
                                  item.packageSize,
                                  item.flavor
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4 " />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-[11px] text-yellow-600 font-bold">
                              {getAvailableQuantity(item) === 0 
                                ? "Out of Stock" 
                                : `Only ${getAvailableQuantity(item)} available`}
                            </p>
                            {getAvailableQuantity(item) > 0 && (
                              <button
                                onClick={() => handleQuantityChange(item, "set", getAvailableQuantity(item))}
                                className="text-[12px] text-[#8CC63F] hover:underline font-bold"
                              >
                                Update to {getAvailableQuantity(item)}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Your cart is empty
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="mt-auto">
          <div className="grid w-full gap-4">
            {items.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            )}
            {items.length > 0 && (
              <Button
                className={`w-full ${inStockItems.length === 0 ? "bg-gray-400" : "bg-[#8CC63F] hover:bg-[#7AB32F]"}`}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/shop/cart");
                }}
                disabled={inStockItems.length === 0}
              >
                Complete Your Purchase ({inStockItems.length})
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsCartOpen(false);
                navigate("/shop");
              }}
            >
              {items.length > 0 ? "Continue Shopping" : "Start Shopping"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

CartSidebar.propTypes = {
  isCartOpen: PropTypes.bool.isRequired,
  setIsCartOpen: PropTypes.func.isRequired,
};

export default CartSidebar;
