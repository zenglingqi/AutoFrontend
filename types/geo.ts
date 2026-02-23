export interface Region {
    name: string
}

export interface Country {
    id: number
    name: string
    iso2: string
    iso3?: string
    phone_code?: string
    region?: string
    subregion?: string
    emoji?: string
    hasStates?: boolean
}

export interface State {
    id: number
    name: string
    state_code?: string
    hasCities?: boolean
}

export interface City {
    id: number
    name: string
    latitude?: string
    longitude?: string
}
