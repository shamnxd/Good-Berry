import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "@/store/shop-slice";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId, variantId) => {
    dispatch(removeFromWishlist({ productId, variantId }));
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <Card className='!border-none !shadow-none !rounded-none'>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No items in your wishlist yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Card className='!border-none !shadow-none !rounded-none !p-0'>
        <CardHeader className="!p-4">
          <CardTitle className="text-xl">My Wishlist ({wishlist.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="!p-4 !pt-3">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((item) => {
              const discountPercentage = item.price > 0 ? (((item.price - item.salePrice) / item.price) * 100).toFixed(0) : 0;
              const hasDiscount = discountPercentage > 0;

              return (
                <Card key={item.productId} className="group overflow-hidden rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative">
                  <div className="relative aspect-square overflow-hidden rounded-t-xl cursor-pointer" onClick={() => navigate(`/shop/product/${item.productId}`)}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {hasDiscount && (
                        <div className="bg-[#8cc63f] text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-[8px] sm:text-[10px] font-bold shadow-md">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                    {/* Remove button overlay */}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 left-2 bg-white/60 hover:bg-white/90 text-red-500 rounded-full h-8 w-8 sm:h-9 sm:w-9 transition-opacity shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.productId, item.variantId);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <CardContent 
                    className="p-3 sm:p-4 !pb-2 flex-grow cursor-pointer"
                    onClick={() => navigate(`/shop/product/${item.productId}`)}
                  >
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-1 leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <p className={`text-[10px] sm:text-[11px] mt-1 font-medium ${item.stockStatus === "OUT OF STOCK" ? "text-red-600" : item.stockStatus.includes("Limited Stock") ? "text-yellow-600" : "text-green-600"}`}>
                      {item.stockStatus}
                    </p>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 !pt-0 flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                        <span className="font-bold text-[#8cc63f] text-sm sm:text-lg">
                          ₹{item.salePrice.toFixed(0)}
                        </span>
                        {item.price > item.salePrice && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                            ₹{item.price.toFixed(0)}
                          </span>
                        )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistPage;