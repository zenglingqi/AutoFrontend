
export interface EmailItem {
    id: number
    email: string
    verified: boolean
    primary: boolean
}

export interface PhoneItem {
    id: number
    phone: string
    verified: boolean
    primary: boolean
}

export interface OAuthItem {
    provider: string
    linked: boolean
    linkedAt?: string
}

export interface UserInfo {
    id: number
    accountNo: string
    displayName: string
    avatarUrl?: string

    primaryEmail: string | null
    emailVerified: boolean

    primaryPhone: string | null
    phoneVerified: boolean

    emails: EmailItem[]
    phones: PhoneItem[]
    oauth: OAuthItem[]

}

export interface AddressForm {
    id: number | 0;
    recipientName: string; // 对应后端 recipientName consignee收货人
    phone: string;
    phoneCountry: string;
    country: string;
    countryCode: string;
    countryId: number | null;
    province: string;
    provinceId: number | null;
    city: string;
    cityId: number | null;
    district?: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    addressTag: string;
    default: boolean;
}
