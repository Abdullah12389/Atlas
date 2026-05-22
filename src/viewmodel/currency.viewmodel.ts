import type { Component } from "react";
import { CurrencyService } from "../services/currency.api";
import { countryRepository } from "../repository/country.repository";
import type { CurrencyRate } from "../models/types";

class CurrencyViewModel {
    amount: number | "" = 100;
    sourceCurrency: string = "USD";
    targetCurrency: string = "EUR";
    convertedValue: number | null = null;
    exchangeRate: number | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    // Extracted from loaded countries list
    allCurrencies: { code: string; name: string; flag: string }[] = [];

    private subscribers = new Set<any>();
    /**
     * Extracts distinct currency codes, names, and representative flags from the country catalog.
     */
    async extractCurrencies() {
        const countries = await countryRepository.getCountries();
        const map = new Map<string, { code: string; name: string; flag: string }>();

        countries.forEach((country) => {
            if (country.currencies) {
                Object.entries(country.currencies).forEach(([code, detail]) => {
                    console.log(code)
                    const upperCode = code.toUpperCase();
                    if (!map.has(upperCode)) {
                        map.set(upperCode, {
                            code: upperCode,
                            name: detail.name,
                            flag: country.flag || "🏳️"
                        });
                    }
                });
            }
        });

        this.allCurrencies = Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
        this.notify();
    }

    setAmount(val: number | "") {
        this.amount = val;
        this.convertedValue = null;
        this.notify();
    }

    setSourceCurrency(code: string) {
        this.sourceCurrency = code.toUpperCase();
        this.convertedValue = null;
        this.notify();
    }

    setTargetCurrency(code: string) {
        this.targetCurrency = code.toUpperCase();
        this.convertedValue = null;
        this.notify();
    }

    /**
     * Converts the active amount from sourceCurrency to targetCurrency.
     * Implements premium fallback logic: if direct base conversion fails or is unsupported,
     * it fetches EUR-base rates and performs cross-rate triangulation (e.g., USD -> EUR -> JPY).
     */
    async convert(): Promise<void> {
        if (this.amount === "" || this.amount <= 0) {
            this.error = "Please enter an amount greater than 0.";
            this.convertedValue = null;
            this.notify();
            return;
        }

        const src = this.sourceCurrency;
        const tgt = this.targetCurrency;

        if (src === tgt) {
            this.exchangeRate = 1.0;
            this.convertedValue = Number(this.amount);
            this.error = null;
            this.notify();
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.convertedValue = null;
        this.notify();

        try {
            // Attempt 1: Fetch direct rates with sourceCurrency as base
            try {
                const rates = await CurrencyService.getRates(src);
                const rateObj = rates.find(r => r.quote.toUpperCase() === tgt);

                if (rateObj) {
                    this.exchangeRate = rateObj.rate;
                    this.convertedValue = Number(this.amount) * rateObj.rate;
                    this.isLoading = false;
                    this.notify();
                    return;
                }
            } catch (directError) {
                console.log(`Direct conversion for base ${src} failed. Trying EUR triangulation fallback...`);
            }

            // Attempt 2: Fallback to EUR Triangulation (Cross-Rate mapping)
            // Fetch default EUR rates (always supported by Frankfurter API)
            const eurRates = await CurrencyService.getRates("EUR");

            // Map the quotes to a lookup dictionary
            const rateLookup = new Map<string, number>();
            eurRates.forEach(r => rateLookup.set(r.quote.toUpperCase(), r.rate));

            // Rate of EUR to EUR is 1.0
            rateLookup.set("EUR", 1.0);

            const rateSrcInEur = rateLookup.get(src);
            const rateTgtInEur = rateLookup.get(tgt);

            if (rateSrcInEur !== undefined && rateTgtInEur !== undefined) {
                // Triangulate: 1 Unit Src = (1 / rateSrcInEur) EUR
                // 1 EUR = rateTgtInEur Tgt
                // Therefore, 1 Unit Src = (rateTgtInEur / rateSrcInEur) Tgt
                const crossRate = rateTgtInEur / rateSrcInEur;
                this.exchangeRate = crossRate;
                this.convertedValue = Number(this.amount) * crossRate;
            } else {
                // If either currency is not supported in the exchange rates list at all
                const missing = !rateSrcInEur ? src : tgt;
                throw new Error(`Currency "${missing}" is not currently supported by our currency exchange provider.`);
            }
        } catch (err) {
            this.error = err instanceof Error ? err.message : "An error occurred during currency conversion.";
            this.convertedValue = null;
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    // Subscription pattern
    subscribe(callback: () => void): () => void {
        console.log(callback)
        this.subscribers.add(callback);

        callback(); // initial sync render

        return () => {
            this.subscribers.delete(callback);
        };
    }

    unsubscribe(view: Component | any) {
        this.subscribers.delete(view);
    }

    notify() {
        this.subscribers.forEach((view) => {
            if (typeof view.setState === "function") {
                view.setState({});
            } else if (typeof view === "function") {
                view();
            }
        });
    }
}

export const currencyVM = new CurrencyViewModel();
