'use client';

import { useState } from "react";
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
import IntlPhoneInput from "@/components/Auth/IntlPhoneInput";
import GeoSelect from "@/components/Geo/GeoSelect";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import {AddressForm} from "@/types/userProfileTypes";



interface Props {
    onCloseAction: () => void;
    onAddedAction: () => void;
    initialData?: AddressForm;
}

export default function AddressFormModal({ onCloseAction, onAddedAction, initialData }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AddressForm>(initialData || {
        id:0,
        recipientName: "",
        phone: "",
        phoneCountry: "US",
        country: "",
        countryCode: "",
        countryId: null,
        province: "",
        provinceId: null,
        city: "",
        cityId: null,
        district: "",
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
        addressTag: "",
        default: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = formData.id ? "/api/user/address/update" : "/api/user/address/add";
            const res = await clientAPIFrame(endpoint, {
                method: formData.id ? "PUT" : "POST",
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onAddedAction();
                onCloseAction();
            }
        } catch (err) {
            console.error("Address persistence failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // 统一的黑色科技感 Input 样式
    const inputClass = `
        w-full h-12 px-5 rounded-2xl text-[11px] font-medium transition-all outline-none
        border border-border/40 bg-foreground/[0.02] text-foreground
        focus:border-gold/50 focus:ring-1 focus:ring-gold/10 placeholder:text-muted/30
    `;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-card border border-border/60 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border/40 flex justify-between items-center">
                    <div>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">
                            {formData.id ? "Update Location" : "New Sanctuary"}
                        </h2>
                        <p className="text-[9px] text-muted mt-1 uppercase tracking-widest italic">Shipping Destination</p>
                    </div>
                    <button onClick={onCloseAction} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                        <X size={18} className="text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* 收件人 */}
                    <input
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleChange}
                        placeholder="Recipient Name *"
                        className={inputClass}
                        required
                    />

                    {/* 电话组件适配 (保持你原有的 IntlPhoneInput) */}
                    <div className="relative">

                        <IntlPhoneInput
                            value={formData.phone}
                            // 更新电话号码
                            onChangeAction={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                            // ⭐ 更新电话所属国家简码
                            onCountryChangeAction={(code) => setFormData(prev => ({ ...prev, phoneCountry: code }))}
                        />
                    </div>

                    {/* 地区选择器适配 */}
                    <div className="space-y-1 [&_select]:h-12 [&_select]:rounded-2xl [&_select]:text-[11px] [&_select]:border-border/40 [&_select]:bg-foreground/[0.02] [&_select]:px-4">
                        <GeoSelect
                            value={{ countryId: formData.countryId, stateId: formData.provinceId, cityId: formData.cityId }}
                            onChange={(v) => setFormData(p => ({
                                ...p,
                                countryId: v.countryId, provinceId: v.stateId, cityId: v.cityId,
                                country: v.countryName || p.country, province: v.stateName || p.province,
                                city: v.cityName || p.city, countryCode: v.countryCode || p.countryCode
                            }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="district" value={formData.district} onChange={handleChange} placeholder="District" className={inputClass} />
                        <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="ZIP/Postcode *" className={inputClass} required />
                    </div>

                    <div className="space-y-3">
                        <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Street Address *" className={inputClass} required />
                        <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className={inputClass} />
                    </div>

                    {/* 默认地址开关 */}
                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.default}
                                onChange={handleChange}
                                className="peer h-5 w-5 appearance-none rounded-md border border-border/60 checked:bg-gold checked:border-gold transition-all"
                            />
                            <CheckCircle2 size={12} className="absolute left-1 text-background opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                            Set as primary destination
                        </span>
                    </label>

                    {/* Actions */}
                    <div className="pt-4 grid grid-cols-2 gap-4">
                        <button type="button" onClick={onCloseAction} className="h-12 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 transition-all">
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-background transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Save Details"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}