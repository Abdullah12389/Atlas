import axios from "axios";
import { parseJsonPromise } from "./countries.api";
import type { CurrencyRate } from "../models/types";

const CurrencyConversionApI = "https://api.frankfurter.dev/v2/rates";

export const CurrencyService = {
    /**
     * Fetches current exchange rates for a specific base currency.
     * Fetches as raw text, then converts the JSON string to JavaScript objects using a Promise.
     */
    async getRates(baseCurrency: string): Promise<CurrencyRate[]> {
        const url = `${CurrencyConversionApI}?base=${encodeURIComponent(baseCurrency.toUpperCase())}`;
        
        try {
            // Fetch rates as raw text to parse using custom Promise
            const response = await axios.get<string>(url, { responseType: "text" });
            
            if (!response.data || typeof response.data !== "string") {
                throw new Error("Invalid response received from Frankfurter API.");
            }
            
            // Use custom Promise to parse raw JSON text to JS objects
            return await parseJsonPromise<CurrencyRate[]>(response.data);
        } catch (error) {
            console.error(`Error in CurrencyService.getRates for ${baseCurrency}:`, error);
            // Handle error, e.g. base currency not supported or offline
            throw new Error(`Failed to load exchange rates for ${baseCurrency}. Base currency may not be supported by Frankfurter API.`);
        }
    }
};
