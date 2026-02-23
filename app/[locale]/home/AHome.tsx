

import TopBar from '@/app/[locale]/home/components/HTopBar';
import Hero from '@/app/[locale]/home/components/HHero';
import TopProducts from '@/app/[locale]/home/components/HTopProducts';
import Benefits from '@/app/[locale]/home/components/HBenefits';
import About from '@/app/[locale]/home/components/HAbout';

import CTABanner from '@/app/[locale]/home/components/HCTABanner';

import "@/app/[locale]/home/components/AHome.css"
import {CategoryQuickLinks} from "@/app/[locale]/home/components/CategoryQuickLinks";

import {CookieBanner} from "@/app/[locale]/home/components/CookieBanner";

export default async function HomePage() {


    return (
        <div className="min-h-screen pt-[48px]">
            <TopBar />
            {/* <Header /> */}

            <main>
                <Hero />
                <TopProducts />
                <Benefits />
                <About />


                <CategoryQuickLinks />


                <CTABanner />








                <CookieBanner/>
            </main>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 dark:bg-gray-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors z-50"
                type="button"
                aria-label="Scroll to top"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
}
