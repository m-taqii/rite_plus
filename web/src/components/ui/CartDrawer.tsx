'use client';

import React from 'react';
import Image from 'next/image';
import { usePharmacy } from '@/context/PharmacyContext';
import {
  CartIcon,
  CloseIcon,
  SnowflakeIcon,
  FileTextIcon,
  MinusIcon,
  PlusIcon,
  CameraIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    setIsPrescriptionModalOpen,
  } = usePharmacy();

  if (!isCartOpen) return null;

  const hasColdChainItem = cart.some((item) => item.product.isColdChain);
  const hasPrescriptionItem = cart.some((item) => item.product.requiresPrescription);
  const deliveryFee = cartSubtotal >= 1000 ? 0 : 99;
  const grandTotal = cartSubtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border-hairline bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-hairline p-5">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5 text-brand" />
            <h2 className="font-sans text-lg font-bold text-ink">
              Your Medicine Cart ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center border border-border-hairline text-ink-muted transition-colors hover:border-ink hover:text-ink"
            aria-label="Close cart"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Notices */}
        {(hasColdChainItem || hasPrescriptionItem) && (
          <div className="border-b border-border-hairline bg-subtle p-3 text-xs space-y-1.5">
            {hasColdChainItem && (
              <div className="flex items-center gap-1.5 text-sky-800 font-medium">
                <SnowflakeIcon className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Includes Cold-Storage Items (Delivered with free ice packs)</span>
              </div>
            )}
            {hasPrescriptionItem && (
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <FileTextIcon className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                <span>Includes Prescription Medicines (Pharmacist will verify)</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border-hairline bg-subtle">
                <CartIcon className="h-8 w-8 text-ink-muted" />
              </div>
              <p className="mt-3 font-sans text-base font-bold text-ink">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Add medicines or health devices from the store.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 border border-border-hairline bg-surface p-3 transition-colors hover:border-brand"
              >
                {/* Product Thumbnail */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border-hairline bg-white">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-sans text-xs font-bold text-ink">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-ink-muted">
                        {item.product.dosage}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-sans text-xs font-extrabold text-ink">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-border-hairline">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center text-ink hover:bg-subtle"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="flex h-6 w-7 items-center justify-center border-x border-border-hairline text-xs font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center text-ink hover:bg-subtle"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="border-t border-border-hairline bg-subtle p-5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-ink-secondary">
                <span>Medicines Subtotal:</span>
                <span>Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-secondary">
                <span>30-Minute Delivery:</span>
                <span className="font-semibold text-emerald-800">
                  {deliveryFee === 0 ? 'FREE (Orders over Rs. 1,000)' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-border-hairline pt-2 text-sm font-bold text-ink">
                <span>Total Amount:</span>
                <span className="text-brand">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {hasPrescriptionItem && (
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsPrescriptionModalOpen(true);
                }}
                className="mt-3 flex w-full items-center justify-center gap-1.5 border border-emerald-600 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <CameraIcon className="h-4 w-4" />
                <span>Attach Doctor&apos;s Prescription Slip</span>
              </button>
            )}

            <button
              onClick={() => {
                alert(`Order Placed: Rs. ${grandTotal.toLocaleString()} order confirmed. Our pharmacist will call you in 2 minutes.`);
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 border border-brand bg-brand py-3 font-sans text-xs font-bold text-white transition-colors hover:bg-brand-hover"
            >
              <span>Proceed to Checkout</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-ink-muted">
              Cash on Delivery & Bank Transfer Accepted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
