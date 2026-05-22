import type { Component } from "react";
import { countryRepository } from "../repository/country.repository";
import type { Country } from "../models/types";

class DashboardViewModel {
    countries: Country[] = [];
    filteredCountries: Country[] = [];
    searchQuery: string = "";
    regionFilter: string = "all"; // "all", "landlocked", "island", "Africa", "Americas", "Asia", "Europe", "Oceania"
    selectedCountry: Country | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    private subscribers = new Set<any>();

    constructor() {
        // Auto-initialize if repository is already populated
        this.updateState();
    }

    private updateState() {
        this.countries = countryRepository.getCountries();
        this.applyFilters();
    }

    async initialize(): Promise<void> {
        this.isLoading = true;
        this.error = null;
        this.notify();

        try {
            await countryRepository.initialize();
            this.updateState();
        } catch (err) {
            this.error = err instanceof Error ? err.message : "Failed to load global country catalog.";
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.applyFilters();
        this.notify();
    }

    setRegionFilter(region: string) {
        this.regionFilter = region;
        this.applyFilters();
        this.notify();
    }

    setSelectedCountry(country: Country | null) {
        this.selectedCountry = country;
        this.notify();
    }

    /**
     * Filters the total cached list of countries based on the active search query and region filters.
     */
    applyFilters() {
        let baseList = this.countries;

        // 1. Search Query filter (using Repository's advanced multi-field search)
        if (this.searchQuery.trim() !== "") {
            baseList = countryRepository.searchCountries(this.searchQuery);
        }

        // 2. Region / Geopolitical category filter
        if (this.regionFilter === "landlocked") {
            this.filteredCountries = baseList.filter(c => c.landlocked);
        } else if (this.regionFilter === "island") {
            // Islands are countries with no borders and not landlocked
            this.filteredCountries = baseList.filter(c => (!c.borders || c.borders.length === 0) && !c.landlocked);
        } else if (this.regionFilter !== "all") {
            this.filteredCountries = baseList.filter(c => c.region === this.regionFilter);
        } else {
            this.filteredCountries = baseList;
        }
    }

    // React components subscribe on mount to trigger renders
    subscribe(view: Component | any) {
        this.subscribers.add(view);
        return () => this.unsubscribe(view);
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

export const dashboardVM = new DashboardViewModel();
export default dashboardVM;
