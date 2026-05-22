import React, { useEffect, useState } from "react";
import useViewModel from "../viewmodel/useViewModel";
import { dashboardVM } from "../viewmodel/dashboard.viewmodel";
import { CountryCard } from "./CountryCard.view";
import { CurrencyConverterView } from "./CurrencyConverter.view";
import { PathFinderView } from "./PathFinder.view";
import type { Country } from "../models/types";
import { pathVM } from "../viewmodel/path.viewmodel";
import { currencyVM } from "../viewmodel/currency.viewmodel";

export const GlobalDashboardView: React.FC = () => {
    // Reactively bind to dashboardVM using custom hook
    const vm = useViewModel(dashboardVM);

    // Active sub-view tab: "catalog" | "currency" | "path"
    const [activeTab, setActiveTab] = useState<"catalog" | "currency" | "path">("catalog");

    // Dynamic pagination card limit for fluid render speeds
    const [displayLimit, setDisplayLimit] = useState(12);

    // Initial load
    useEffect(() => {
        vm.initialize();
    }, []);

    // Reset pagination display limit whenever filters update
    useEffect(() => {
        setDisplayLimit(12);
    }, [vm.searchQuery, vm.regionFilter]);

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 12);
    };

    // When clicking a border neighbor tag, trigger a jump search to that country card
    const handleNeighborNavigation = (cca3: string) => {
        vm.setSelectedCountry(null); // Close modal if open
        setActiveTab("catalog"); // Navigate to catalog
        vm.setSearchQuery(cca3); // Search and isolate the neighbor country
    };

    const handleOptionClick = (tab: "catalog" | "currency" | "path") => {
        setActiveTab(tab);
        // Sync VM initializations if switching
        if (tab === "path") {
            pathVM.initialize();
        }
    };

    const getTabHeaderTitle = () => {
        switch (activeTab) {
            case "currency": return "💱 Live Forex Converters";
            case "path": return "🗺️ Geopolitical Route Finders";
            default: return "🌎 Global Travel & Tour Catalog";
        }
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-8 font-sans bg-gray-50 dark:bg-[#0c0a0f] min-h-screen box-border block text-left transition-colors duration-200">
            
            {/* Elegant Header Title banner */}
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white m-0 tracking-tight leading-tight">
                    {getTabHeaderTitle()}
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1.5">
                    Navigate borders, convert localized exchanges, and visualize international graphs in MVVM.
                </p>
            </div>

            {/* Premium Dynamic Options Tabs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full">
                {/* Option 1: Global Catalog */}
                <button 
                    onClick={() => handleOptionClick("catalog")}
                    className={`bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-l-4 rounded-lg p-4 flex items-center gap-3.5 text-left shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 group cursor-pointer ${
                        activeTab === "catalog" 
                            ? "border-l-purple-500 dark:border-l-purple-600 bg-purple-50/20 dark:bg-purple-950/10 border-purple-200 dark:border-zinc-700" 
                            : "border-l-gray-300 dark:border-l-zinc-700"
                    }`}
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🌎</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Global Catalog</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Browse 250+ countries & specs</span>
                    </div>
                </button>

                {/* Option 2: Currency Converter */}
                <button 
                    onClick={() => handleOptionClick("currency")}
                    className={`bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-l-4 rounded-lg p-4 flex items-center gap-3.5 text-left shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 group cursor-pointer ${
                        activeTab === "currency" 
                            ? "border-l-red-500 dark:border-l-red-600 bg-red-50/20 dark:bg-red-950/10 border-red-200 dark:border-zinc-700" 
                            : "border-l-gray-300 dark:border-l-zinc-700"
                    }`}
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">💱</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Convert Currencies</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Real-time FX rates & formulas</span>
                    </div>
                </button>

                {/* Option 3: Geopolitical Hops */}
                <button 
                    onClick={() => handleOptionClick("path")}
                    className={`bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-l-4 rounded-lg p-4 flex items-center gap-3.5 text-left shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-150 group cursor-pointer ${
                        activeTab === "path" 
                            ? "border-l-blue-600 dark:border-l-blue-700 bg-blue-50/20 dark:bg-blue-950/10 border-blue-200 dark:border-zinc-700" 
                            : "border-l-gray-300 dark:border-l-zinc-700"
                    }`}
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🗺️</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Find Country Path</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">BFS overland route solver</span>
                    </div>
                </button>
            </div>

            {/* TAB CONTENT VIEWS CONTAINER */}
            <div className="w-full">
                
                {/* 1. GLOBAL CATALOG VIEW */}
                {activeTab === "catalog" && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Filter Hub Console */}
                        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm w-full box-border">
                            {/* Full text multi-field search */}
                            <div className="relative flex-1 flex items-center w-full">
                                <span className="absolute left-3.5 text-gray-400 dark:text-zinc-500 text-base">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search by name, 3-letter code, languages or currency symbols..." 
                                    value={vm.searchQuery}
                                    onChange={(e) => vm.setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none focus:border-purple-500 dark:focus:border-purple-600 transition-colors box-border"
                                />
                                {vm.searchQuery && (
                                    <button 
                                        onClick={() => vm.setSearchQuery("")}
                                        className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white border-none bg-transparent cursor-pointer font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Regional drop filter */}
                            <select 
                                value={vm.regionFilter}
                                onChange={(e) => vm.setRegionFilter(e.target.value)}
                                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 cursor-pointer outline-none md:min-w-[220px] focus:border-purple-500 dark:focus:border-purple-600 transition-colors box-border"
                            >
                                <option value="all">All Global Regions</option>
                                <option value="Africa">Africa</option>
                                <option value="Americas">Americas</option>
                                <option value="Asia">Asia</option>
                                <option value="Europe">Europe</option>
                                <option value="Oceania">Oceania</option>
                                <option value="landlocked">Landlocked Nodes Only</option>
                                <option value="island">Oceanic Island Nodes</option>
                            </select>
                        </div>

                        {/* Error and Loading indicators */}
                        {vm.isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 w-full gap-3">
                                <span className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin inline-block"/>
                                <span className="text-sm font-semibold text-gray-600 dark:text-zinc-400">Loading dynamic country index...</span>
                            </div>
                        )}

                        {vm.error && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium w-full text-center">
                                ⚠️ {vm.error}
                            </div>
                        )}

                        {/* Empty results states */}
                        {!vm.isLoading && !vm.error && vm.filteredCountries.length === 0 && (
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center w-full">
                                <span className="text-5xl block mb-3">🔍</span>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100">No matching countries found</h4>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                                    We couldn't find any country records matching "{vm.searchQuery}". Try revising your spelling or selected region filters.
                                </p>
                                <button 
                                    onClick={() => { vm.setSearchQuery(""); vm.setRegionFilter("all"); }}
                                    className="mt-4 px-4 py-2 bg-purple-600 text-white border-none rounded-lg text-xs font-semibold cursor-pointer hover:bg-purple-700 transition-colors"
                                >
                                    Reset Search Filters
                                </button>
                            </div>
                        )}

                        {/* Grid Catalog */}
                        {!vm.isLoading && !vm.error && vm.filteredCountries.length > 0 && (
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full auto-rows-fr">
                                    {vm.filteredCountries.slice(0, displayLimit).map((country) => (
                                        <CountryCard 
                                            key={country.cca3}
                                            country={country}
                                            onNeighborClick={handleNeighborNavigation}
                                            onClick={() => vm.setSelectedCountry(country)}
                                        />
                                    ))}
                                </div>

                                {/* Dynamic Page Incrementor Button */}
                                {vm.filteredCountries.length > displayLimit && (
                                    <button 
                                        onClick={handleLoadMore}
                                        className="mx-auto px-8 py-3.5 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-800 rounded-xl font-bold text-sm cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        Load More Countries ({vm.filteredCountries.length - displayLimit} remaining)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. CURRENCY CONVERTER VIEW */}
                {activeTab === "currency" && (
                    <div className="w-full max-w-[700px] mx-auto">
                        <CurrencyConverterView />
                    </div>
                )}

                {/* 3. GEOPOLITICAL PATH FINDER VIEW */}
                {activeTab === "path" && (
                    <div className="w-full max-w-[800px] mx-auto">
                        <PathFinderView />
                    </div>
                )}
            </div>

            {/* DETAILED COUNTRY MODAL OVERLAY */}
            {vm.selectedCountry && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                    onClick={() => vm.setSelectedCountry(null)}
                >
                    <div 
                        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-[550px] shadow-2xl overflow-hidden flex flex-col text-left transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image Flag panel */}
                        <div className="relative p-6 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center gap-4 text-white">
                            <span className="text-6xl select-none" role="img" aria-label="Flag">
                                {vm.selectedCountry.flag || "🏳️"}
                            </span>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl sm:text-2xl font-black truncate m-0 leading-tight">
                                    {vm.selectedCountry.name.common}
                                </h3>
                                <p className="text-xs text-purple-100 mt-1.5 truncate">
                                    {vm.selectedCountry.name.official}
                                </p>
                            </div>
                            <button 
                                onClick={() => vm.setSelectedCountry(null)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer font-bold text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Specs grid */}
                        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                            {/* Regional tags row */}
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 px-2 py-0.5 rounded">
                                    🗺️ {vm.selectedCountry.region} ({vm.selectedCountry.subregion || "N/A"})
                                </span>
                                {vm.selectedCountry.landlocked && (
                                    <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 px-2 py-0.5 rounded">
                                        ⛰️ Landlocked Node
                                    </span>
                                )}
                            </div>

                            {/* Core Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 text-sm my-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Capital City</span>
                                    <span className="text-gray-900 dark:text-zinc-200 font-semibold mt-0.5">
                                        {vm.selectedCountry.capital && vm.selectedCountry.capital.length > 0
                                            ? vm.selectedCountry.capital.join(", ")
                                            : "No documented capital"}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">ISO 3166-1 Code</span>
                                    <span className="text-gray-900 dark:text-zinc-200 font-semibold mt-0.5 font-mono">
                                        {vm.selectedCountry.cca3}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Official Languages</span>
                                    <span className="text-gray-900 dark:text-zinc-200 font-semibold mt-0.5">
                                        {vm.selectedCountry.languages 
                                            ? Object.values(vm.selectedCountry.languages).join(", ")
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Currencies Used</span>
                                    <span className="text-gray-900 dark:text-zinc-200 font-semibold mt-0.5">
                                        {vm.selectedCountry.currencies
                                            ? Object.entries(vm.selectedCountry.currencies)
                                                  .map(([code, cur]) => `${cur.name} (${code}${cur.symbol ? ` - ${cur.symbol}` : ""})`)
                                                  .join(", ")
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Detailed UTC Offset info */}
                            <div className="flex flex-col bg-gray-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <span className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Timezones Mapping</span>
                                <span className="text-gray-800 dark:text-zinc-300 font-semibold mt-0.5 text-xs">
                                    {vm.selectedCountry.timezones?.join(", ")}
                                </span>
                            </div>

                            {/* Interactive neighbors portal inside modal */}
                            <div className="flex flex-col mt-1">
                                <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                    📍 Overland Neighbor Hops ({vm.selectedCountry.borders?.length || 0}):
                                </span>
                                {vm.selectedCountry.borders && vm.selectedCountry.borders.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pr-1 max-h-[84px] overflow-y-auto">
                                        {vm.selectedCountry.borders.map((code) => (
                                            <button 
                                                key={`modal-${code}`} 
                                                onClick={() => handleNeighborNavigation(code)}
                                                className="text-[11px] font-bold bg-gray-50 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-1 rounded border border-gray-200 dark:border-zinc-700 transition-colors cursor-pointer inline-block"
                                            >
                                                {code}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 dark:text-zinc-500 italic">No bordering countries (Island nation).</span>
                                )}
                            </div>
                        </div>

                        {/* Modal Action CTA bar */}
                        <div className="p-4 bg-gray-50 dark:bg-zinc-800/20 border-t border-t-gray-100 dark:border-t-zinc-800/80 flex gap-2 justify-end">
                            <button 
                                onClick={() => {
                                    const code = vm.selectedCountry!.cca3;
                                    vm.setSelectedCountry(null);
                                    setActiveTab("path");
                                    pathVM.initialize();
                                    pathVM.setOrigin(code);
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                                🗺️ Origin Node
                            </button>
                            <button 
                                onClick={() => {
                                    const code = vm.selectedCountry!.cca3;
                                    vm.setSelectedCountry(null);
                                    setActiveTab("path");
                                    pathVM.initialize();
                                    pathVM.setDestination(code);
                                }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                                🎯 Destination Node
                            </button>
                            {vm.selectedCountry.currencies && (
                                <button 
                                    onClick={() => {
                                        const code = Object.keys(vm.selectedCountry!.currencies!)[0];
                                        vm.setSelectedCountry(null);
                                        setActiveTab("currency");
                                        currencyVM.setSourceCurrency(code);
                                    }}
                                    className="px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-none rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
                                >
                                    💱 Source Currency
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalDashboardView;
