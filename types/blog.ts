export interface BlogDetailVO {
    id: number;
    slug: string;
    languageCode: string;

    // Media resources (supports multiple images)
    mainImage: string;
    thumbnailImage: string;
    ogImage: string;
    imageAlt: string; // SEO core for images

    // Core content
    title: string;
    excerpt: string;  // Excerpt for list display or Meta Description
    content: string;  // This will be a block-structured JSON string

    // SEO enhancement
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string; // Standard link to prevent duplicate content

    // Top-level SEO: Backend generated Article structured data
    jsonLd: Record<string, any>;  // Structure for Article Schema (JSON-LD)

    // Conversion funnel: Associated products and recommended blog posts
    relatedProducts: ProductSimpleDTO[];
    relatedPosts: BlogShortVO[];

    createdAt: string;  // Date formatted in ISO 8601 (e.g. "2026-02-15T00:00:00Z")
    updatedAt: string;  // Date formatted in ISO 8601
}

export interface ProductSimpleDTO {
    productCode: string;
    name: string;
    slug: string;
    mainImage: string;  // Only the main image
    minPrice: number;  // List page shows "From $99.00"
    originalPrice: number;
    currencyCode: string;
    brandName: string;

    swatches: string[];  // Color/spec previews (e.g. ["#FF0000", "#000000"])

    isNewIn: boolean;  // New within 30 days
    inStock: boolean;  // Whether it's out of stock or not

    // Promotional Information
    hasPromotion: boolean;
    promotionPrice: number;  // Promotional price = price - promValue or price * promValue

    discountLabel: string; // Example: "-20%", "Save $15", or "Flash Sale"
    promoValue: number;    // 0.8 or 10 (direct discount, converted based on currency)
    type: string;
    startTime: string;     // Date in ISO 8601
    endTime: string;       // Date in ISO 8601

    rating: number;        // Rating like 4.8
    reviewCount: number;   // Number of reviews (e.g., 120)
}

export interface BlogShortVO {
    id: number;
    slug: string;
    mainImage: string;
    createdAt: string;  // Date formatted in ISO 8601
    title: string;
}

export enum PromotionType {
    DIRECT_DISCOUNT = 'DIRECT_DISCOUNT', // Direct discount (e.g., 0.8)
    FIXED_REDUCTION = 'FIXED_REDUCTION', // Fixed reduction (e.g., -$10)
    FLASH_SALE = 'FLASH_SALE',           // Flash sale price (directly overrides price)
}