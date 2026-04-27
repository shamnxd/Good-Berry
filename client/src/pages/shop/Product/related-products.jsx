import { useRef, useState, useEffect } from 'react'
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getSingleProduct } from '@/store/shop-slice'


export default function RelatedProducts({products, id}) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -286 : 286 
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleProductClick = async (id) => {
    try {
      navigate(`/shop/product/${id}`);
      await dispatch(getSingleProduct(id));
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  return (
    <section className="w-full lg:py-12 mt-8">
      <div className="container lg:px-0 px-4 overflow-hidden">
        <h2 className="text-xl md:text-2xl font-medium mb-6 md:mb-12">Related products</h2>
        
        <div className="relative mx-[-1rem] md:mx-[-1.5rem]">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 px-4 md:px-6 snap-x snap-mandatory scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={checkScroll}
          >
            {products && products.map((product) => (
              <Card 
                key={product._id} 
                className="border-none shadow-none flex-none w-[180px] md:w-[280px] snap-start text-center"
                onClick={() => handleProductClick(product._id)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative mb-3">
                    <img
                      src={product?.firstVariant?.images}
                      alt={product?.name}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-medium mb-2">{product?.name}</h3>
                  <div className="flex flex-col gap-1">
                    <span className="text-primary">₹{product?.firstVariant?.salePrice.toFixed(2)}</span>
                    {product.isOriginal && (
                      <span className="text-sm text-muted-foreground">Original</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background shadow-md",
              !canScrollLeft && "hidden"
            )}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background shadow-md",
              !canScrollRight && "hidden"
            )}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
