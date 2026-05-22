import type { Component } from "react";
import { countryRepository } from "../repository/country.repository";
import type { Country, PathResult } from "../models/types";

class PathViewModel {
    origin: string = "DEU";
    destination: string = "ITA";
    result: PathResult | null = null;
    isLoading: boolean = false;
    showFullGraph: boolean = false;
    
    // Loaded list for selection lists
    countries: Country[] = [];

    private subscribers = new Set<any>();

    constructor() {
        this.updateState();
    }

    private updateState() {
        this.countries = countryRepository.getCountries()
            .filter(c => c.borders && c.borders.length > 0) // Only include countries with border nodes to make routing sensible
            .sort((a, b) => a.name.common.localeCompare(b.name.common));
    }

    initialize() {
        this.updateState();
        this.notify();
    }

    setOrigin(code: string) {
        this.origin = code.toUpperCase();
        this.result = null;
        this.notify();
    }

    setDestination(code: string) {
        this.destination = code.toUpperCase();
        this.result = null;
        this.notify();
    }

    setShowFullGraph(show: boolean) {
        this.showFullGraph = show;
        this.notify();
    }

    /**
     * Calculates the shortest border path using the BFS algorithm in countryRepository.
     */
    computePath() {
        if (!this.origin || !this.destination) {
            this.result = { path: [], transfersCount: 0, error: "Please select both origin and destination countries." };
            this.notify();
            return;
        }

        this.isLoading = true;
        this.result = null;
        this.notify();

        // Standard JS microtask delay for smooth UI feedback and simulation of computational complexity
        setTimeout(() => {
            try {
                const pathResult = countryRepository.findPath(this.origin, this.destination);
                this.result = pathResult;
            } catch (error) {
                this.result = {
                    path: [],
                    transfersCount: 0,
                    error: error instanceof Error ? error.message : "Failed to calculate border path."
                };
            } finally {
                this.isLoading = false;
                this.notify();
            }
        }, 300);
    }

    // Subscription pattern
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

export const pathVM = new PathViewModel();
export default pathVM;
