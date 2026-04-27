
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Eye } from "lucide-react"

export function FeaturedProductCard({ product }) {
  const { name, _id, description } = product;
  const imageUrl = product.firstVariant.images;
  const salePrice = product.firstVariant.salePrice;
  const originalPrice = product.firstVariant.price;

  const discountPercentage = (((originalPrice - salePrice) / originalPrice) * 100).toFixed(0);
  const hasDiscount = discountPercentage > 0;

  return (
    <Link to={`/shop/product/${_id}`} className="block group h-full">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-sm rounded-2xl h-full flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm transition-colors cursor-pointer text-[10px] sm:text-sm px-2 py-1">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Quick View
            </Badge>
          </div>
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
        </div>
        <CardContent className="p-3 sm:p-5 flex flex-col flex-1">
          <h3 className="font-signika text-sm sm:text-xl font-bold text-gray-900 line-clamp-1">{name}</h3>
          {description && (
            <p className="mt-2 text-[10px] sm:text-sm text-gray-500 line-clamp-1 leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <p className="text-base sm:text-2xl font-bold text-[#8CC63F]">₹{Number.parseFloat(salePrice).toFixed(0)}</p>
              {hasDiscount && (
                <p className="text-[10px] sm:text-sm text-gray-400 line-through">₹{Number.parseFloat(originalPrice).toFixed(0)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}



