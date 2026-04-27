import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

const ProductCard = ({ product, id, view }) => {
  const isListView = view === "menu";

  const discountPercentage = (((product.firstVariant.price - product.firstVariant.salePrice) / product.firstVariant.price) * 100).toFixed(0);
  const hasDiscount = discountPercentage > 0;

  return (
    <Card className={cn(
      "group overflow-hidden rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 h-full",
      isListView ? "flex flex-row gap-3 sm:gap-6 p-2 sm:p-4 bg-white items-center" : "flex flex-col"
    )}>
      <Link 
        to={`/shop/product/${id}`} 
        className={cn(
          "relative block overflow-hidden rounded-lg",
          isListView ? "w-24 h-24 sm:w-48 sm:h-48 flex-shrink-0" : "aspect-square w-full"
        )}
      >
        <img
          src={product.firstVariant.images || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {hasDiscount && (
            <div className="bg-[#8cc63f] text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-[8px] sm:text-xs font-bold shadow-md">
              -{discountPercentage}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-[#438e44] text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-[8px] sm:text-xs font-bold shadow-md">
              New
            </div>
          )}
        </div>
        {!isListView && (
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm transition-colors cursor-pointer text-[10px] sm:text-sm px-2 py-1">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Quick View
            </Badge>
          </div>
        )}
      </Link>

      <div className={cn(
        "flex flex-col flex-1",
        isListView ? "justify-center" : "justify-between"
      )}>
        <CardContent className={cn(
          "flex flex-col",
          isListView ? "!p-0" : "p-3 sm:p-4 !pb-2"
        )}>
          <h3 className={cn(
            "font-semibold line-clamp-1 leading-tight sm:leading-normal",
            isListView ? "text-sm sm:text-xl" : "text-sm sm:text-lg"
          )}>
            <Link to={`/shop/product/${id}`}>{product.name}</Link>
          </h3>
          {product.description && (
            <p className="text-[10px] sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-1 max-w-lg">
              {product?.description}
            </p>
          )}
        </CardContent>

        <CardFooter className={cn(
          "flex items-center",
          isListView 
            ? "p-0 mt-2 sm:mt-4 gap-3 sm:gap-6" 
            : "p-3 sm:p-4 !pt-0 mt-auto flex-col items-start gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-2"
        )}>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className={cn(
              "font-bold text-[#8cc63f]",
              isListView ? "text-base sm:text-2xl" : "text-base sm:text-lg"
            )}>
              ₹{product.firstVariant.salePrice.toFixed(0)}
            </span>
            {product.firstVariant.price > product.firstVariant.salePrice && (
              <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                ₹{product.firstVariant.price.toFixed(0)}
              </span>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
