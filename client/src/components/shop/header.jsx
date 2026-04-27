import { Menu, Search, Heart, ShoppingCart, UserRound, X, Award, Home, ShoppingBag, Info, Mail, LogOut, Wallet } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import { logodark, logolight } from '@/assets/images';
import CartSidebar from '@/pages/shop/cart/cart-sidebar';

function HomeHeader() {

    const [isScrolled, setIsScrolled] = useState(false)
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart.items)
    const navigate = useNavigate();

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal - items.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    const total = subtotal - discount;

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 80)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 z-50 w-full py-1 transition-colors duration-300 ${isScrolled ? 'bg-white home-header shadow-sm' : 'bg-white sm:bg-transparent'}`}>
        <div className="flex h-16 items-center px-4 lg:p-0 container mx-auto !max-w-[1400px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="transparent" size="icon" className={`md:hidden ${isScrolled ? 'text-black' : 'text-black sm:text-white'}`}>
                <Menu className="!h-8 !w-8 !font-bold" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
              <div className="p-6 border-b flex flex-col gap-6">
                <img src={logodark} alt="Logo" className="h-8 w-fit" />
                <div 
                  className="relative cursor-pointer"
                  onClick={() => navigate('/search')}
                >
                  <div className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 pl-4 pr-10 text-sm text-gray-400 transition-all hover:bg-gray-100">
                    Search for products
                  </div>
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col">
                  <Link to="/" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-b border-gray-50 transition-colors flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    HOME
                  </Link>
                  <Link to="/shop" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-b border-gray-50 transition-colors flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                    SHOP
                  </Link>
                  <Link to="/contact" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-b border-gray-50 transition-colors flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    CONTACT US
                  </Link>
                  <Link to="/about" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-b border-gray-50 transition-colors flex items-center gap-3">
                    <Info className="h-5 w-5 text-gray-400" />
                    ABOUT US
                  </Link>
                  
                  <div className="mt-auto bg-gray-50/80">
                    <Link to="/account/orders" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-t border-gray-100 transition-colors flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      MY ORDERS
                    </Link>
                    <Link to="/account/wishlist" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-t border-gray-100 transition-colors flex items-center gap-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      WISHLIST
                    </Link>
                    <Link to="/account/wallet" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-t border-gray-100 transition-colors flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      WALLET
                    </Link>
                    <Link to="/account/refer" className="px-6 py-4 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-t border-gray-100 transition-colors flex items-center gap-3">
                      <Award className="h-5 w-5 text-gray-400" />
                      REFER & EARN
                    </Link>
                    <Link to={user ? '/account/details' : 'auth/login'} className="px-6 py-5 text-base font-medium text-gray-800 hover:text-[#8CC63F] border-t border-gray-100 transition-colors flex items-center gap-3">
                      <UserRound className="h-5 w-5 text-[#8CC63F]" />
                      {user ? 'MY ACCOUNT' : 'LOGIN / REGISTER'}
                    </Link>
                    {user && (
                      <button 
                        onClick={() => dispatch(logoutUser()).then(() => navigate('/'))}
                        className="w-full px-6 py-5 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-t border-gray-100 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="h-5 w-5" />
                        LOGOUT
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <nav className="hidden md:flex items-center space-x-6 ml-4">
            <Link to="/" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              HOME
            </Link>
            <Link to="/shop" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              SHOP
            </Link>
            <Link to="/contact" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              CONTACT US
            </Link>
            <Link to="/about" className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
              ABOUT US
            </Link>
          </nav>
  
          <div className="flex flex-1 items-center justify-center">
            <Link to="/" className="flex items-center">
              <img src={isScrolled ? logodark : (window.innerWidth < 640 ? logodark : logolight)} alt="Logo" className="lg:h-8 h-6 transition-all" />
            </Link>
          </div>
  
          <div className="flex items-center gap-1 md:me-4">
            <Link to={user ? '/account' : 'auth/login'} className={`text-sm font-medium ${isScrolled ? 'text-black' : 'text-black sm:text-white'} hidden md:block`}>
              {user ? <UserRound className={`!h-6 !w-6 !fw-bold mx-2 ${isScrolled ? 'text-black' : 'text-white'}`}/> : 'LOGIN/REGISTER'}
            </Link>
            <Button variant="transparent" size="icon" className="hidden md:flex" onClick={() => navigate('/search')}>
              <Search className={`!h-6 !w-6 ${isScrolled ? 'text-black' : 'text-white'} !fw-bold`} />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="transparent" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className={`!h-8 lg:!h-6 !w-8 lg:!w-6 ${isScrolled ? 'text-black' : 'text-black sm:text-white'} !fw-bold`} />
              <span className="sr-only">Cart</span>
              <span className="absolute right-0 -top-0 h-4 w-4 rounded-full bg-[#8CC63F] text-[10px] font-bold text-white flex items-center justify-center">
                {items.length}
              </span>
            </Button>
            <span className={`hidden md:block text-sm font-bold ${isScrolled ? 'text-black' : 'text-white'}`}>₹{total.toFixed(2)}</span>
          </div>
        </div>
          <CartSidebar isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      </header>
    )
}

export default HomeHeader;