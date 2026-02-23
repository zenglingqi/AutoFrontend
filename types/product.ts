export interface ProductAttribute {
    label: string;
    code: string;
    swatch: string | null;
    sort: number;
}

export interface ProductVariant {
    skuCode: string;
    stock: number;
    weight: number | null;
    price: number;
    compareAtPrice: number;
    currencyCode: string;
    hasPromotion: boolean;
    promotionPrice: number;
    promoValue: number;
    type: string;
    attributes: Record<string, string>;
    attributeDisplays: Record<string, ProductAttribute>;
}

export interface ProductMedia {
    variantCode: string;
    mediaType: 'IMAGE' | 'VIDEO';
    url: string;
    coverUrl: string | null;
    main: boolean;
}

export interface ProductCategory {
    categoryCode: string;
    name: string;
    slug: string;
    primary: boolean;
}

export interface ProductDetailData {
    id: number;
    productCode: string;
    name: string;
    subtitle: string;
    description: string;
    detailHtml: string;
    brandName: string;
    mediaList: ProductMedia[];
    variants: ProductVariant[];
    categories: ProductCategory[];
    attributeKeyDisplays: Record<string, string>;
    // SEO 相关
    seoTitle: string;
    seoKeywords: string;
    seoDescription: string;
    ogImage: string;
}