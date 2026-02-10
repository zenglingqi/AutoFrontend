// src/components/Header/HeaderActions.tsx

import {ThemeButton } from "@/components/Header/ThemeButton.tsx";
import {LanguageSwitcher} from "./LanguageSwitcher"
import CurrencySwitcher from "@/components/Header/CurrencySwitcher"

import { BagButton, BagDrawer } from './UserCar'
import {SearchBottomSheet} from "@/components/Header/Search/SearchBottomSheet.tsx";
import {SearchButton} from "@/components/Header/Search/SearchButton.tsx"

export function HeaderActions({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {


    return (
        <>
            <div className="flex items-center gap-4">
                {/* 其它图标 */}
                <ThemeButton/>


                {/* 桌面 */}
                <div className="hidden md:block">
                    <SearchButton/>
                </div>

                {/* 移动 */}
                <div className="md:hidden">
                    <SearchBottomSheet/>
                </div>


                <CurrencySwitcher/>
                <LanguageSwitcher persistKey="lang" />

                <BagButton/>

                {/* 汉堡按钮：lg 以下显示 */}
                <button
                    className="lg:hidden inline-flex items-center justify-center p-2 "
                    aria-label="Toggle Menu"
                    onClick={(e) => {
                        e.stopPropagation()
                        onMobileMenuToggle?.()
                    }}
                >
                    <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="6" width="16" height="2" rx="1" />
                        <rect x="4" y="11" width="16" height="2" rx="1" />
                        <rect x="4" y="16" width="16" height="2" rx="1" />
                    </svg>
                </button>
            </div>

            {/* --<SO />-- Drawer（全局挂在 Header 下） ---- */}
                <BagDrawer/>
        </>

    )
}
