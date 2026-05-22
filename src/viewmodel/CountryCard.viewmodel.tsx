import type { Component } from "react"
import { countryRepository } from "../repository/country.repository";
import type { Country } from "../models/types";

class CountryCardViewModel {
    data: Country[]
    private subscribers: Set<Component>
    constructor(initalValue: Country[]) {
        this.data = initalValue
        this.subscribers = new Set()
    }
    async updateText() {
        this.data = countryRepository.getCountries()
        this.subscribers.forEach((view) => view.setState({}))
    }
    subscribe(view: Component) {
        this.subscribers.add(view)
        return () => this.subscribers.delete(view)
    }
    unsubscribe(view: Component) {
        this.subscribers.delete(view)
    }
}
export const CountryCardVM = new CountryCardViewModel([]);