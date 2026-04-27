import { Home, Store, Wallet,  User, Package, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      label: 'Shop',
      icon: ShoppingBag,
      path: '/shop',
    },
    // {
    //   label: 'Wallet',
    //   icon: Wallet,
    //   path: '/account/wallet',
    // },
    {
      label: 'Orders',
      icon: Package,
      path: '/account/orders',
    },
    {
      label: 'Account',
      icon: User,
      path: '/account',
    },
  ];

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    if (path === '/account') {
      return currentPath === '/account' || (currentPath.startsWith('/account/') && !currentPath.includes('/account/orders'));
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[40] h-[68px] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 relative ${
                active ? 'text-[#8CC63F]' : 'text-gray-400'
              }`}
            >
              <Icon 
                className={`h-[28px] w-[28px] mb-1 transition-all duration-200 ${
                  active ? 'text-[#8CC63F]' : 'text-gray-700'
                }`} 
                strokeWidth={2}
              />
              <span className={`text-[11px] font-bold tracking-tight transition-all duration-200 ${
                active ? 'text-[#8CC63F]' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-8 h-1 bg-[#8CC63F] rounded-t-full transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
