// src/utils/sortCountries.ts
import type { Country } from "@/types/geo.ts"
import { PRIORITY_COUNTRY_ISO2} from "@/components/Geo/priorityCountries";

export function sortCountriesWithPriority(
    countries: Country[]
): Country[] {
    const prioritySet = new Set(PRIORITY_COUNTRY_ISO2)

    const priority: Country[] = []
    const normal: Country[] = []

    for (const c of countries) {
        if (prioritySet.has(c.iso2)) {
            priority.push(c)
        } else {
            normal.push(c)
        }
    }

    // ⭐ 保证 priority 顺序与配置一致
    priority.sort(
        (a, b) =>
            PRIORITY_COUNTRY_ISO2.indexOf(a.iso2) -
            PRIORITY_COUNTRY_ISO2.indexOf(b.iso2)
    )

    // 其他国家按名称排序
    normal.sort((a, b) => a.name.localeCompare(b.name))

    return [...priority, ...normal]
}
