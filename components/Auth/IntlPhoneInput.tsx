'use client';

import { useRef } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function IntlPhoneInput({ value, onChange, placeholder }: any) {
    return (
        <div className="fashion-phone-input w-full relative group">
            <PhoneInput
                value={value}
                onChange={(v) => onChange(v)}
                defaultCountry={"hk"}
                className="w-full flex items-center"
                // 移除所有框线，仅保留文字，靠外部容器控制样式
                inputClassName="!bg-transparent !border-none !text-sm !text-[#4A443F] dark:!text-[#E5E0D8] !w-full !p-0 !h-auto !outline-none !shadow-none !placeholder-[#BCB5AC]"
                countrySelectorStyleProps={{
                    buttonClassName: '!bg-transparent !border-none !p-0 !pr-3 !opacity-60 hover:!opacity-100 transition-opacity',
                    dropdownArrowClassName: 'dark:!border-[#C5A059] !border-[#4A443F]',
                    flagClassName: '!rounded-sm !scale-90 !grayscale-[0.2]',
                }}
            />
            {/* 极细底边线：浅色用米灰，深色用深岩色 */}
            <div className="absolute bottom-[-6px] left-0 w-full h-[1px] bg-[#E5E0D8] dark:bg-[#2A2826] group-focus-within:bg-[#C5A059] transition-colors" />

            <style jsx global>{`
                .react-international-phone-input-container { background: transparent !important; border: none !important; }
                /* 下拉列表深浅适配 */
                .react-international-phone-country-selector-dropdown {
                    background-color: #FDFBF7 !important; /* Light Base */
                    border: 1px solid #E5E0D8 !important;
                }
                .dark .react-international-phone-country-selector-dropdown {
                    background-color: #1C1A19 !important; /* Dark Surface */
                    border: 1px solid #2A2826 !important;
                }
                .react-international-phone-country-selector-list-item { color: #4A443F !important; }
                .dark .react-international-phone-country-selector-list-item { color: #E5E0D8 !important; }
                .react-international-phone-country-selector-list-item:hover { background-color: #F4F0E8 !important; }
                .dark .react-international-phone-country-selector-list-item:hover { background-color: #2A2826 !important; }
            `}</style>
        </div>
    );
}