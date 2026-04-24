'use client';
import {useState, useEffect} from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, MapPin, PhoneIcon } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { api } from '~/trpc/react';
import { CartDropdown } from './CartDropdown';


export const Header = () => {
  const { data: session } = useSession();
  const { data: cart } = api.cart.getCart.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isHoveredPhone, setIsHoveredPhone] = useState(false);
  const [isHoveredCart, setIsHoveredCart] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemCount = isMounted && session ? cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0 : 0;

  return (
    <header className='bg-surface-soft/40 group fixed top-0 left-0 w-full z-50 transition-all duration-300'>
      
      {/*WRAPPER*/}
      <div className='transition-all duration-300 group-hover:bg-blur-hover group-hover:backdrop-blur-xs'>

        {/*TOP BAR*/}
        <div className='relative flex items-center px-6 py-3'>
          {/*LEFT*/}
          <div className='flex items-center gap-4 text-text-secondary'>
            <MapPin size={24} className='cursor-pointer' />
            <PhoneIcon
              size={24}
              className='cursor-pointer'
              onMouseEnter={() => setIsHoveredPhone(true)}
              onMouseLeave={() => setIsHoveredPhone(false)}
            />
            <h3
              className={`hidden sm:block text-sm text-text-secondary transition-opacity duration-700 ease-in-out ${isHoveredPhone ? 'opacity-100' : 'opacity-0'}`}>
              8 123 456 78 90
            </h3>
          </div>

          {/*CENTER*/}
          <h1 className='
              pointer-events-none
              absolute left-1/2 -translate-x-1/2
              uppercase text-text-primary tracking-[0.08em]'>
            Store
          </h1>

          {/* {RIGHT} */}
          <div className='ml-auto flex items-center gap-4 text-text-secondary '>
            <button className='hover:text-text-primary transition-colors cursor-pointer'>
              <Search size={24} />
            </button>
            <div
              className='relative'
              onMouseEnter={() => setIsHoveredCart(true)}
              onMouseLeave={() => setIsHoveredCart(false)}
            >
              <button className='hover:text-text-primary transition-colors cursor-pointer mt-2'>
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-2'>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
              <CartDropdown isVisible={isHoveredCart} />
            </div>
            <button
              onClick={() => session ? signOut() : signIn()}
              className='hover:text-text-primary transition-colors cursor-pointer'
            >
              <User size={24} />
            </button>
          </div>
        </div>

        {/* {GRADIENT LINE} */}
        <div className='h-px w-full bg-linear-to-r from-primary/0 via-primary to-primary/0 opacity-40'/>

        {/* {BOTTOM BAR} */}
        <div className='flex items-center justify-center gap-8 mx-20 px-6 py-3 text-sm text-text-secondary'>
          <span className='cursor-pointer'>Lighting</span>
          <span className='cursor-pointer'>Kitchen & Beverage</span>
          <span className='cursor-pointer'>Storage & Furniture</span>
          <span className='cursor-pointer'>Climate Control</span>
          <span className='cursor-pointer'>Appliances</span>
          <span className='cursor-pointer'>Smart Home</span>
          <span className='cursor-pointer'>Audio & Entertainment</span>
        </div>
      </div>

    </header>
  );
};