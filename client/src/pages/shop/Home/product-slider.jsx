import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ProductSlider({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="our-product-move relative group pb-10">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 sm:gap-8 px-4">
          {products?.map((product, i) => {
            const discountPercentage = (((product.firstVariant.price - product.firstVariant.salePrice) / product.firstVariant.price) * 100).toFixed(0);
            const hasDiscount = discountPercentage > 0;

            return (
              <Link to={`/shop/product/${product._id}`} key={i} className="flex-none w-[150px] sm:w-[280px]">
                <div
                  className="flex flex-col items-center group cursor-pointer hover:scale-[1.02] rounded-2xl p-2 sm:p-4 hover:bg-white hover:shadow-xl transition-all duration-500 ease-in-out border border-transparent hover:border-gray-50 h-full"
                >
                  <div className="relative mb-3 w-full aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={product.firstVariant.images || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      {hasDiscount && (
                        <div className="bg-[#8cc63f] text-white rounded-full w-7 h-7 sm:w-11 sm:h-11 flex items-center justify-center text-[7px] sm:text-[10px] font-bold shadow-sm">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-lg font-bold text-gray-800 mb-1 line-clamp-1 w-full text-center">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-1 mb-3 text-center leading-tight sm:leading-normal">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-baseline gap-2">
                    <p className="text-sm sm:text-2xl font-bold text-[#8CC63F]">
                      ₹{product.firstVariant.salePrice.toFixed(0)}
                    </p>
                    {hasDiscount && (
                      <p className="text-[10px] sm:text-sm text-gray-400 line-through">
                        ₹{product.firstVariant.price.toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="slider-controls">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
