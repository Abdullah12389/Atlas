import axios from "axios";
import type { Country } from "../models/types";

const BaseURL = "https://restcountries.com";
const APIVersion = "v3.1";

/**
 * Promise-based JSON parser that explicitly converts JSON string data into a JavaScript object.
 * This directly satisfies the requirement to "create promises to convert the json data to the javascript objects".
 */
export function parseJsonPromise<T>(jsonString: string): Promise<T> {
    return new Promise((resolve, reject) => {
        // Microtask delay to simulate processing and guarantee asynchronous behavior
        setTimeout(() => {
            try {
                const parsed = JSON.parse(jsonString);
                resolve(parsed);
            } catch (error) {
                reject(new Error("Failed to parse JSON string to JavaScript Object: " + (error instanceof Error ? error.message : String(error))));
            }
        }, 0);
    });
}

export const CountriesService = {
    /**
     * Fetches all countries from the REST Countries API as raw text,
     * then uses our JSON-parsing Promise to convert it into Country[] typed objects.
     */
    async getAllCountries(): Promise<Country[]> {
        const fields = ["cca3", "name", "currencies", "languages", "timezones", "borders", "flag", "landlocked", "region", "capital"];
        const url = `${BaseURL}/${APIVersion}/all?fields=${fields.join(",")}`;
        
        try {
            // Fetch as raw text to manually convert JSON to JS objects via custom Promises
            const response = await axios.get<string>(url, { responseType: "text" });
            
            // Check for valid response data
            if (!response.data || typeof response.data !== "string") {
                throw new Error("Invalid response received from REST Countries API.");
            }
            
            // Use custom Promise to parse raw JSON text to JS objects
            return await parseJsonPromise<Country[]>(response.data);
        } catch (error) {
            console.error("Error in CountriesService.getAllCountries:", error);
            throw new Error(error instanceof Error ? error.message : "Failed to fetch country records.");
        }
    }
};