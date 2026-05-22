import { CountriesService } from "../services/countries.api";
import type { Country, PathResult, PathHop } from "../models/types";

class CountryRepository {
    private countries: Country[] = [];
    private countriesMap: Map<string, Country> = new Map();
    private isInitialized = false;

    /**
     * Initializes the repository by fetching all countries and caching them.
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            const data = await CountriesService.getAllCountries();
            this.countries = data;

            // Populate lookup map for faster access and BFS traversal
            this.countriesMap.clear();
            data.forEach((country) => {
                if (country.cca3) {
                    this.countriesMap.set(country.cca3.toUpperCase(), country);
                }
            });

            this.isInitialized = true;
        } catch (error) {
            console.error("Failed to initialize CountryRepository:", error);
            throw error;
        }
    }

    /**
     * Get all loaded countries.
     */
    getCountries(): Country[] {
        return this.countries;
    }

    /**
     * Get a single country by its 3-letter code (case-insensitive).
     */
    getCountryByCode(code: string): Country | undefined {
        return this.countriesMap.get(code.toUpperCase());
    }
    searchCountries(query: string): Country[] {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return this.countries;

        return this.countries.filter((country) => {
            // 1. Search by name (common and official)
            const commonName = country.name?.common?.toLowerCase() || "";
            const officialName = country.name?.official?.toLowerCase() || "";
            if (commonName.includes(trimmed) || officialName.includes(trimmed)) {
                return true;
            }

            // 2. Search by country code
            const cca3 = country.cca3?.toLowerCase() || "";
            if (cca3 === trimmed || cca3.includes(trimmed)) {
                return true;
            }

            // 3. Search by languages
            if (country.languages) {
                const langCodes = Object.keys(country.languages).map(k => k.toLowerCase());
                const langNames = Object.values(country.languages).map(v => v.toLowerCase());
                if (langCodes.includes(trimmed) || langNames.some(name => name.includes(trimmed))) {
                    return true;
                }
            }

            // 4. Search by currencies
            if (country.currencies) {
                const currencyCodes = Object.keys(country.currencies).map(k => k.toLowerCase());
                if (currencyCodes.includes(trimmed)) return true;

                const currencyDetails = Object.values(country.currencies);
                if (currencyDetails.some(curr => curr.name?.toLowerCase().includes(trimmed))) {
                    return true;
                }
            }

            return false;
        });
    }

    /**
     * Computes the shortest path of borders from one country to another using Breadth-First Search (BFS).
     * Properly handles all edge cases (islands, same countries, unconnected landmasses).
     * 
     * This directly implements the pathfinding function.
     */
    findPath(originCode: string, destinationCode: string): PathResult {
        const start = originCode.toUpperCase();
        const end = destinationCode.toUpperCase();

        const startCountry = this.countriesMap.get(start);
        const endCountry = this.countriesMap.get(end);

        // Edge Case 1: Validate input existence
        if (!startCountry) {
            return { path: [], transfersCount: 0, error: `Origin country code "${start}" is invalid or could not be found.` };
        }
        if (!endCountry) {
            return { path: [], transfersCount: 0, error: `Destination country code "${end}" is invalid or could not be found.` };
        }

        // Edge Case 2: Origin is the same as Destination
        if (start === end) {
            const hop: PathHop = {
                cca3: startCountry.cca3,
                name: startCountry.name.common,
                flag: startCountry.flag || "🏳️"
            };
            return { path: [hop], transfersCount: 0 };
        }

        // Edge Case 3: Start country is landlocked/island with no borders
        if (!startCountry.borders || startCountry.borders.length === 0) {
            return {
                path: [],
                transfersCount: 0,
                error: `${startCountry.name.common} is an island or has no documented land borders. Overland travel is impossible.`
            };
        }

        // Edge Case 4: End country has no borders
        if (!endCountry.borders || endCountry.borders.length === 0) {
            return {
                path: [],
                transfersCount: 0,
                error: `${endCountry.name.common} is an island or has no documented land borders. Overland travel is impossible.`
            };
        }

        // BFS Setup: Simple queue of country codes and parent tracker map
        const queue: string[] = [start];
        const visited = new Set<string>([start]);
        const parent = new Map<string, string>(); // tracks which country we came from: neighbor -> parent

        let pathFound = false;

        // Traverse the graph level by level
        while (queue.length > 0) {
            const current = queue.shift()!;

            // If we reached our target destination, stop searching
            if (current === end) {
                pathFound = true;
                break;
            }

            const currentCountry = this.countriesMap.get(current);
            if (currentCountry && currentCountry.borders) {
                for (const neighbor of currentCountry.borders) {
                    const neighborUpper = neighbor.toUpperCase();

                    if (!visited.has(neighborUpper)) {
                        visited.add(neighborUpper);
                        parent.set(neighborUpper, current); // Record parent node
                        queue.push(neighborUpper);
                    }
                }
            }
        }

        // If no path was found, return a clean error
        if (!pathFound) {
            return {
                path: [],
                transfersCount: 0,
                error: `No overland border connection found between ${startCountry.name.common} and ${endCountry.name.common}. They are on separate landmasses or split by oceans.`
            };
        }

        // Backtrack from Destination to Origin using our parent map to build the final route
        const pathCodes: string[] = [];
        let backtrackNode: string | undefined = end;
        while (backtrackNode) {
            pathCodes.push(backtrackNode);
            backtrackNode = parent.get(backtrackNode);
        }

        // Reverse the array to get the sequence from Origin to Destination
        pathCodes.reverse();

        // Convert the short country codes back into rich objects for the UI
        const pathHops: PathHop[] = pathCodes.map((code) => {
            const country = this.countriesMap.get(code)!;
            return {
                cca3: country.cca3,
                name: country.name.common,
                flag: country.flag || "🏳️"
            };
        });

        return {
            path: pathHops,
            transfersCount: pathHops.length - 1
        };
    }
}

export const countryRepository = new CountryRepository();
export default countryRepository;
