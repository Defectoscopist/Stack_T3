'use client';
import React from 'react';
import { X } from 'lucide-react';
import { api } from '~/trpc/react';

interface CartDropdownProps {
  isVisible: boolean;
}

export const CartDropdown = ({ isVisible }: CartDropdownProps) => {
  const { data: cart, refetch } = api.cart.getCart.useQuery(undefined, {
    enabled: isVisible,
  });

  const clearCartMutation = api.cart.clearCart.useMutation({
    onSuccess: () => refetch(),
  });

  const removeItemMutation = api.cart.removeItem.useMutation({
    onSuccess: () => refetch(),
  });

  const handleClearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  const handleRemoveItem = async (cartItemId: string) => {
    await removeItemMutation.mutateAsync({ cartItemId });
  };

  if (!isVisible) return null;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  return (
    <div className='absolute top-full right-0 mt-[-42] mr-[-10] w-96 bg-surface-soft rounded-lg shadow-xl z-40 overflow-hidden'>
      {/* HEADER */}
      <div className='px-4 py-3 border-b border-primary/20'>
        <h3 className='text-text-primary font-medium'>Shopping Cart</h3>
      </div>

      {/* ITEMS */}
      <div className='max-h-96 overflow-y-auto'>
        {items.length === 0 ? (
          <div className='px-4 py-8 text-center text-text-secondary'>
            Your cart is empty
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className='px-4 py-3 border-b border-primary/10 hover:bg-surface/50 transition-colors'
            >
              <div className='flex gap-3'>
                {/* IMAGE */}
                {item.variant.images?.[0] && (
                  <img
                    src={item.variant.images[0].url}
                    alt={item.variant.product.name}
                    className='w-12 h-12 rounded object-cover'
                  />
                )}

                {/* INFO */}
                <div className='flex-1 min-w-0'>
                  <h4 className='text-text-primary text-sm font-medium truncate'>
                    {item.variant.product.name}
                  </h4>
                  {item.variant.color && (
                    <p className='text-text-secondary text-xs mt-1'>
                      Color: {item.variant.color}
                    </p>
                  )}
                  <div className='flex justify-between items-center mt-2'>
                    <span className='text-text-secondary text-xs'>
                      {item.quantity}x ${Number(item.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className='text-text-secondary hover:text-text-primary transition-colors p-0.5'
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {items.length > 0 && (
        <>
          <div className='px-4 py-3 border-t border-primary/20 bg-surface'>
            <div className='flex justify-between items-center mb-3'>
              <span className='text-text-secondary'>Итого:</span>
              <span className='text-text-primary font-semibold'>
                ${total.toFixed(2)}
              </span>
            </div>

            <div className='flex gap-2'>
              <button
                onClick={handleClearCart}
                disabled={clearCartMutation.isPending}
                className='flex-1 px-3 py-2 text-sm text-text-secondary border border-primary/30 rounded hover:bg-primary/10 hover:text-text-primary transition-colors disabled:opacity-50'
              >
                Clear Cart
              </button>
              <button className='flex-1 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/80 transition-colors font-medium'>
                Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
