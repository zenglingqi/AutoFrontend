// hooks/useGeoData.ts
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

export interface Country {
    id: number;
    name: string;
    iso2: string;
    emoji: string; // 后台返回的 emoji 字符串
    phone_code: string;
}

export const getCountries = async (): Promise<Country[]> => {
    const res = await clientAPIFrame('/api/geo/countries');
    if (!res.ok) return [];
    return res.json();
};