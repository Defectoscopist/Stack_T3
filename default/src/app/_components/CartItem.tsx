"use client";

import Image from "next/image";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      imagesUrl: string[];
    };
    variant: {
      id: string;
      price: number;
      stock: number;
      color: string | null;
      size: string;
    };
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const subtotal = item.variant.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      <div className="flex-shrink-0 w-20 h-20 relative">
        {item.product.imagesUrl && item.product.imagesUrl.length > 0 ? (
          <Image
            src={item.product.imagesUrl[0]!}
            alt={item.product.name}
            fill
            className="object-cover rounded"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-600">
          Size: {item.variant.size}
          {item.variant.color && `, Color: ${item.variant.color}`}
        </p>
        <p className="text-sm text-gray-500">${item.variant.price.toFixed(2)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-12 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, Math.min(item.variant.stock, item.quantity + 1))}
          className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"
          disabled={item.quantity >= item.variant.stock}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">${subtotal.toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-600 hover:text-red-800 p-2"
        title="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}