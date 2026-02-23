// src/api/get.ts

import type {
    City,
    Country,
    Region,
    State,
} from "@/types/geo.ts"
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";


async function apiGet<T>(url: string): Promise<T> {
    const res = await clientAPIFrame(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
    }

    return res.json()
}

/* =========================
 * Regions
 * ========================= */

export const GetRegions = async (): Promise<Region[] | []> => {
    return apiGet<Region[]>("/api/geo/regions")
}

/* =========================
 * Countries
 * ========================= */

export const GetCountries = async (): Promise<Country[] | []> => {
    return apiGet<Country[]>("/api/geo/countries")
}

export const GetCountriesByRegion = async (
    region: string
): Promise<Country[] | []> => {
    if (!region) return GetCountries()
    return apiGet<Country[]>(
        `/api/geo/countries?region=${encodeURIComponent(region)}`
    )
}

/* =========================
 * Phone codes（兼容旧库）
 * ========================= */

export const GetPhonecodes = async (): Promise<
    {
        id: number
        name: string
        phone_code?: string
        region?: string
    }[] | []
> => {
    const countries = await GetCountries()
    return countries.map((c) => ({
        id: c.id,
        name: c.name,
        phone_code: c.phone_code,
        region: c.region,
    }))
}

export const GetPhonecodesByRegion = async (
    region: string
): Promise<
    {
        id: number
        name: string
        phone_code?: string
        region?: string
    }[] | []
> => {
    const countries = await GetCountriesByRegion(region)
    return countries.map((c) => ({
        id: c.id,
        name: c.name,
        phone_code: c.phone_code,
        region: c.region,
    }))
}

/* =========================
 * States
 * ========================= */

export const GetState = async (
    countryId: number
): Promise<State[] | []> => {
    if (!countryId) return []
    return apiGet<State[]>(`/api/geo/countries/${countryId}/states`)
}

/* =========================
 * Cities
 * ========================= */

export const GetCity = async (
    countryId: number,
    stateId: number
): Promise<City[] | []> => {
    if (!countryId || !stateId) return []
    return apiGet<City[]>(
        `/api/geo/countries/${countryId}/states/${stateId}/cities`
    )
}


