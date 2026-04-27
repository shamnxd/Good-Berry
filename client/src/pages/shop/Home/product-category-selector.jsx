 import { iceCream, jam, juice, snacks, tea } from '@/assets/images'

const Category = ({ icon, label, isActive, onClick }) => (
  <div
    className={`flex flex-col items-center hover:text-[#8CC63F] transition-all duration-300 ease-in-out cursor-pointer transition-all group  ${
      isActive ? 'text-[#8CC63F]' : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    <div className="w-16 h-16 flex items-center justify-center">
      <img src={icon} alt={label} />
    </div>
    <span className="text-xs font-bold tracking-wider">{label}</span>
  </div>
)

export function ProductCategorySelector({ activeCategory, categories, onCategoryChange }) {
  return (
    <div className="our-categorys flex justify-center gap:10 sm:gap-12 mb-8 sm:mb-3 overflow-x-auto no-scrollbar pb-4">
      {categories?.map((category) => (
        <Category
          key={category._id}
          icon={category.image}
          label={category.name.toUpperCase()}
          isActive={activeCategory === category._id}
          onClick={() => onCategoryChange(category._id)}
        />
      ))}
    </div>
  )
}
