'use client';

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// 增加 onCountryChange 定义
interface IntlPhoneInputProps {
    value: string;
    onChangeAction: (phone: string) => void;
    onCountryChangeAction?: (countryCode: string) => void;
}

export default function IntlPhoneInput({ value, onChangeAction, onCountryChangeAction }: IntlPhoneInputProps) {
    return (
        <div className="fashion-phone-input w-full relative group">
            <PhoneInput
                value={value}
                // ⭐ 修改此处：v 是电话号码，meta 包含 country 对象
                onChange={(v, meta) => {
                    onChangeAction(v);
                    if (onCountryChangeAction && meta.country) {
                        // 回传 iso2 码（如 "hk", "us"），转为大写以匹配后端常用格式
                        onCountryChangeAction(meta.country.iso2.toUpperCase());
                    }
                }}
                defaultCountry={"hk"}
                className="w-full flex items-center"
                inputClassName="!bg-transparent !border-none !text-sm !text-foreground !w-full !p-0 !h-auto !outline-none !shadow-none !placeholder-muted/40 font-medium"
                countrySelectorStyleProps={{
                    buttonClassName: '!bg-transparent !border-none !p-0 !pr-3 opacity-100 transition-opacity',
                    dropdownArrowClassName: '!border-foreground/50',
                    flagClassName: '!rounded-sm !scale-100',
                }}
            />

            {/* 保持原有的底边线设计 */}
            <div className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-border group-focus-within:bg-gold transition-colors" />

            <style jsx global>{`
                .react-international-phone-country-selector-dropdown {
                    background-color: rgb(var(--card)) !important;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgb(var(--card-border)) !important;
                    box-shadow: 0 15px 30px -10px rgba(0,0,0,0.2) !important;
                    z-index: 50 !important;
                }
                .react-international-phone-country-selector-list-item {
                    color: rgb(var(--foreground)) !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    padding: 10px !important;
                }
                .react-international-phone-country-selector-list-item:hover {
                    background-color: rgba(var(--card-border), 0.3) !important;
                }
                .react-international-phone-country-selector-list-item--selected {
                    background-color: rgba(var(--card-border), 0.5) !important;
                }
            `}</style>
        </div>
    );
}