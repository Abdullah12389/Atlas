export interface CountryName {
    common: string;
    official: string;
}

export interface Currency {
    name: string;
    symbol?: string;
}

export interface CountryFlags {
    png: string;
    svg: string;
    alt?: string;
}

export interface Country {
    cca3: string;
    name: CountryName;
    currencies?: Record<string, Currency>;
    languages?: Record<string, string>;
    timezones: string[];
    borders?: string[];
    flag?: string; // Emoji representation
    flags: CountryFlags;
    landlocked: boolean;
    region: string;
    subregion?: string;
    capital?: string[];
}

export interface CurrencyRate {
    date: string;
    base: string;
    quote: string;
    rate: number;
}

export interface PathHop {
    cca3: string;
    name: string;
    flag: string;
}

export interface PathResult {
    path: PathHop[];
    transfersCount: number;
    error?: string;
}

export interface GraphNode {
    id: string;
    label: string;
    flag: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    region: string;
}

export interface GraphEdge {
    source: string;
    target: string;
}
