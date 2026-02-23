import { useEffect, useRef, useState } from "react"
import { GetCountries, GetState, GetCity } from "@/app/api/functionsUser/geo"
import type { Country, State, City } from "@/types/geo"
import { GeoDropdown } from "@/components/Geo/GeoDropdown"

interface GeoValue {
    countryId?: number | null
    stateId?: number | null
    cityId?: number | null
}

interface GeoResult {
    countryId: number | null
    stateId: number | null
    cityId: number | null
    countryName?: string
    stateName?: string
    cityName?: string
    countryCode?: string
}

interface Props {
    value?: GeoValue
    onChange: (v: GeoResult) => void
}

export default function GeoSelect({ value, onChange }: Props) {
    /* ========== data state ========== */
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [cities, setCities] = useState<City[]>([])
    const currentCity = cities.find(c => c.id === value?.cityId)

    /* ========== caches ========== */
    const statesCache = useRef<Record<number, State[]>>({})
    const citiesCache = useRef<Record<number, City[]>>({})


    /* ========== load countries once ========== */
    useEffect(() => {
        GetCountries().then(setCountries)
    }, [])

    const currentCountry = countries.find(c => c.id === value?.countryId)
    const currentState = states.find(s => s.id === value?.stateId)

    /* ========== load states ========== */
    useEffect(() => {
        if (!value?.countryId) {
            setStates([])
            setCities([])
            return
        }

        const cached = statesCache.current[value.countryId]
        if (cached) {
            setStates(cached)
            return
        }

        GetState(value.countryId).then(list => {
            statesCache.current[value.countryId!] = list
            setStates(list)
        })
    }, [value?.countryId])

    /* ========== load cities ========== */
    useEffect(() => {
        if (!value?.countryId || !value?.stateId) {
            setCities([])
            return
        }

        const cached = citiesCache.current[value.stateId]
        if (cached) {
            setCities(cached)
            return
        }

        GetCity(value.countryId, value.stateId).then(list => {
            citiesCache.current[value.stateId!] = list
            setCities(list)
        })
    }, [value?.countryId, value?.stateId])

    return (
        <div className="space-y-3">
            {/* ===== Country ===== */}
            <GeoDropdown
                value={currentCountry ?? null}
                options={countries}
                placeholder="Select country"
                getKey={(c) => c.id}
                getSearchText={(c) => `${c.emoji} ${c.name}`}   // ⭐ 加上 emoji
                renderLabel={(c) => (
                    <div className="flex items-center gap-2">
                        <span className="flag-emoji">{c.emoji}</span>
                        <span>{c.name}</span>
                    </div>
                )}
                renderSelected={(c) => (
                    <div className="flex items-center gap-2">
                        <span className="flag-emoji">{c.emoji}</span>
                        <span>{c.name}</span> </div>
                )}
                onChange={(c) => {
                    onChange({
                        countryId: c.id,
                        stateId: null,
                        cityId: null,
                        countryName: c.name,
                        countryCode:c.iso3,
                    })
                }}
            />



            {/* ===== State ===== */}
            {currentCountry?.hasStates && (
                <GeoDropdown
                    value={currentState ?? null}
                    options={states}
                    placeholder="Select state"
                    getKey={(s) => s.id}
                    getSearchText={(s) => s.name}
                    renderLabel={(s) => s.name}
                    renderSelected={(s) => <span>{s.name}</span>}
                    onChange={(s) => {
                        onChange({
                            countryId: value?.countryId ?? null,
                            stateId: s.id,
                            cityId: null,
                            stateName: s.name,
                        })
                    }}
                />

            )}

            {/* ===== City ===== */}
            {currentState?.hasCities && (
                <GeoDropdown
                    value={currentCity ?? null}
                    options={cities}
                    placeholder="Search city"
                    getKey={(c) => c.id}
                    getSearchText={(c) => c.name}
                    renderLabel={(c) => c.name}
                    renderSelected={(s) => <span>{s.name}</span>}
                    onChange={(c) => {
                        onChange({
                            countryId: value?.countryId ?? null,
                            stateId: value?.stateId ?? null,
                            cityId: c.id,
                            cityName: c.name,
                        })
                    }}
                />

            )}
        </div>
    )
}
