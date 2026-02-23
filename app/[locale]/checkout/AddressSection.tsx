'use client';

import { useEffect, useState } from 'react';
import { serverAPIFrame } from "@/app/api/frameAPI/serverAPIFrame"; //
import { Trash2, Plus, Check } from 'lucide-react';
import{ AddressForm } from '@/types/userProfileTypes'


export default function AddressSection() {
    const [addresses, setAddresses] = useState<AddressForm[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // 加载地址列表
    const fetchAddresses = async () => {
        const res = await serverAPIFrame("/api/user/address/list"); // 对接提供的接口
        const data = await res.json();
        setAddresses(data);
        // 默认选中第一个或默认地址
        const defaultAddr = data.find((a: AddressForm) => a.default) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    };

    useEffect(() => { fetchAddresses(); }, []);

    // 删除地址
    const handleDelete = async (id: number) => {
        const res = await serverAPIFrame(`/api/user/address/delete/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAddresses();
    };

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Shipping Sanctuary</h2>
                <button className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-muted hover:text-gold">
                    <Plus size={12} /> Add New Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-6 rounded-3xl border transition-all cursor-pointer relative group ${
                            selectedAddressId === addr.id ? 'border-gold bg-gold/[0.02]' : 'border-border/40 bg-card/20'
                        }`}
                    >
                        {selectedAddressId === addr.id && (
                            <div className="absolute top-4 right-4 text-gold"><Check size={16} /></div>
                        )}
                        <p className="font-serif italic text-lg mb-2">{addr.recipientName}</p>
                        <p className="text-xs text-muted leading-relaxed">
                            {addr.addressLine1}, {addr.city}<br />
                            {addr.province}, {addr.country} {addr.postalCode}
                        </p>
                        <p className="text-[10px] mt-4 text-foreground/60">{addr.phone}</p>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}