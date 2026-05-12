import { Check, SlidersHorizontal } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import MESSAGES from '../../constants/messages';
import {

  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getCategories } from '@/store/shop-slice'
import { useToast } from '@/hooks/use-toast'


const flavors = [
  { id: 'strawberry', name: 'Strawberry', count: 14, color: '#FF4D4D' },
  { id: 'chocolate', name: 'Chocolate', count: 35, color: '#8B4513' },
  { id: 'vanilla', name: 'Vanilla', count: 25, color: '#F3E5AB' },
  { id: 'mango', name: 'Mango', count: 18, color: '#FFD700' },
  { id: 'blueberry', name: 'Blueberry', count: 28, color: '#90EE90' },
]

const statuses = [
  { id: 'Special Offers', label: 'Special Offers' },
  { id: 'In stock', label: 'In stock' },
  { id: 'New', label: 'New' },
]

// Filter Components
export function PriceFilter({ value, onValueChange, onFilter }) {
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">FILTER BY PRICE</h3>
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center"
        value={value}
        max={50000}
        step={1}
        onValueChange={onValueChange}
      >
        <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full bg-[#8CC63F]" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full border border-[#8CC63F] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        <Slider.Thumb className="block h-4 w-4 rounded-full border border-[#8CC63F] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </Slider.Root>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Price: ₹{value[0]} — ₹{value[1]}
        </span>
      </div>
    </div>
  )
}

export function CategoryFilter({ selectedCategories, onCategoryChange }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  const { categories } = useSelector(state => state.shop);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">FILTER BY CATEGORY</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category._id}
            className="flex w-full items-center justify-between group"
            onClick={() => onCategoryChange(category._id)}
          >
            <div className="flex items-center gap-2">
              <img src={category.image} className='w-6 h-6' />
              <span className="text-gray-600 group-hover:text-gray-900">{category.name}</span>
            </div>
            <span className={`text-sm ${
              selectedCategories.includes(category._id) 
                ? 'bg-[#8CC63F] text-white' 
                : 'bg-gray-100 text-gray-600'
            } px-2 py-0.5 rounded-full`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FlavorFilter({ selectedFlavors, onFlavorChange }) {
  const { toast } = useToast();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">FILTER BY FLAVOR</h3>
      <div className="space-y-3">
        {flavors.map((flavor) => (
          <button
            key={flavor.id}
            className="flex w-full items-center justify-between group"
            onClick={(e) => {
              e.stopPropagation();
              onFlavorChange(flavor.name);
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className='h-5 w-5 rounded-full' 
                style={{ backgroundColor: flavor.color }}
              />
              <span className={`transition-colors ${selectedFlavors.includes(flavor.name) ? 'text-black font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {flavor.name}
              </span>
            </div>
            {selectedFlavors.includes(flavor.name) && (
              <div className="h-4 w-4 rounded-full bg-[#8CC63F] flex items-center justify-center" >
                <Check className="text-white h-3 w-3 font-extrabold" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function StatusFilter({ selectedStatuses, onStatusChange }) {
  const { toast } = useToast();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">PRODUCT STATUS</h3>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status.id} className="flex items-center space-x-2">
            <Checkbox
              id={status.id}
              checked={selectedStatuses.includes(status.id)}
              onCheckedChange={() => onStatusChange(status.id)}
              className="border-gray-300 text-[#8CC63F] data-[state=checked]:bg-[#8CC63F] data-[state=checked]:border-[#8CC63F]"
            />
            <Label
              htmlFor={status.id}
              className={`text-sm font-normal leading-none cursor-pointer transition-colors ${selectedStatuses.includes(status.id) ? 'text-black font-medium' : 'text-gray-600'}`}
            >
              {status.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MobileFilters({ 
  priceRange, 
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedFlavors,
  setSelectedFlavors,
  selectedStatuses,
  setSelectedStatuses,
  handleApplyFilters,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto pb-10">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-8">
          <PriceFilter
            value={priceRange}
            onValueChange={setPriceRange}
            onFilter={() => {
              handleApplyFilters();
              setOpen(false);
            }}
          />
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={(categoryId) => {
              setSelectedCategories(prev =>
                prev.includes(categoryId)
                   ? prev.filter(id => id !== categoryId)
                   : [...prev, categoryId]
              )
            }}
          />
          <FlavorFilter
            selectedFlavors={selectedFlavors}
            onFlavorChange={(flavorId) => {
              setSelectedFlavors(prev =>
                prev.includes(flavorId)
                   ? prev.filter(id => id !== flavorId)
                   : [...prev, flavorId]
              )
            }}
          />
          <StatusFilter
            selectedStatuses={selectedStatuses}
            onStatusChange={(statusId) => {
              setSelectedStatuses(prev =>
                prev.includes(statusId)
                   ? prev.filter(id => id !== statusId)
                   : [...prev, statusId]
              )
            }}
          />

          <div className="pt-6">
            <Button 
                className="w-full bg-[#8CC63F] hover:bg-[#7AB32F] text-white font-medium py-6 rounded-xl"
                onClick={() => {
                  handleApplyFilters();
                  setOpen(false);
                }}
              >
                APPLY FILTERS
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


