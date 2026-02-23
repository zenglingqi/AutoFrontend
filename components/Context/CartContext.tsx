// @/components/Context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    cartItemId: string;      // `${skuCode}-${currencyCode}`
    skuCode: string;
    productCode: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    compareAtPrice?: number;
    currencyCode: string;
    selected: boolean;       // 是否选中用于本次结算
    selectedAttributes: Array<{ keyLabel: string; valueLabel: string }>;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addToCart: (product: any, variant: any, currencyCode: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, delta: number) => void;
    toggleSelect: (cartItemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // 初始化加载
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    // 存储变化
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any, variant: any, currencyCode: string) => {
        const cartItemId = `${variant.skuCode}-${currencyCode}`;
        setCartItems(prev => {
            const existing = prev.find(item => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map(item => item.cartItemId === cartItemId
                    ? { ...item, quantity: item.quantity + 1, selected: true }
                    : item
                );
            }
            const newItem: CartItem = {
                cartItemId,
                skuCode: variant.skuCode,
                productCode: product.productCode,
                name: product.name,
                image: product.mediaList?.find((m: any) => m.main)?.url || product.ogImage,
                quantity: 1,
                price: variant.promotionPrice || variant.price,
                compareAtPrice: variant.compareAtPrice,
                currencyCode,
                selected: true,
                selectedAttributes: Object.keys(variant.attributeDisplays || {}).map(key => ({
                    keyLabel: product.attributeKeyDisplays[key],
                    valueLabel: variant.attributeDisplays[key].label
                }))
            };
            return [...prev, newItem];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartItemId: string) =>
        setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const toggleSelect = (cartItemId: string) => {
        setCartItems(prev => prev.map(item =>
            item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
        ));
    };

    return (
        <CartContext.Provider value={{
            cartItems, isCartOpen, setIsCartOpen,
            addToCart, removeFromCart, updateQuantity, toggleSelect
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};