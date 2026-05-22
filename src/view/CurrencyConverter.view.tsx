import React, { useEffect } from "react";
import useViewModel from "../viewmodel/useViewModel";
import { currencyVM } from "../viewmodel/currency.viewmodel";
import { useReducer } from "react";

export const CurrencyConverterView: React.FC = () => {
    // Reactively bind to currencyVM using custom hook
    const vm = useViewModel(currencyVM);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        vm.convert();
    };
    useEffect(() => {
        currencyVM.extractCurrencies();
    }, []);


    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm text-left box-border">
            <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
                💱 Global Currency Converter
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-5">
                Convert localized currency data instantly using real-time foreign exchange mappings. Direct API and cross-rate triangulation fallbacks enabled.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Amount input */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Amount
                    </label>
                    <input 
                        type="number" 
                        step="any"
                        placeholder="Enter amount (e.g. 100)" 
                        value={vm.amount}
                        onChange={(e) => vm.setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-base bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none focus:border-purple-500 dark:focus:border-purple-600 transition-colors"
                        required
                    />
                </div>

                {/* Country Currencies selector row */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex flex-col w-full sm:flex-1">
                        <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                            Source Currency
                        </label>
                        <select 
                            value={vm.sourceCurrency}
                            onChange={(e) => vm.setSourceCurrency(e.target.value)}
                            className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none cursor-pointer focus:border-purple-500 dark:focus:border-purple-600 transition-colors"
                        >
                            {vm.allCurrencies.map((curr) => (
                                <option key={`src-${curr.code}`} value={curr.code}>
                                    {curr.flag} {curr.code} - {curr.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-gray-400 dark:text-zinc-500 text-lg mt-4 hidden sm:block">➡️</div>

                    <div className="flex flex-col w-full sm:flex-1">
                        <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                            Target Currency
                        </label>
                        <select 
                            value={vm.targetCurrency}
                            onChange={(e) => vm.setTargetCurrency(e.target.value)}
                            className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none cursor-pointer focus:border-purple-500 dark:focus:border-purple-600 transition-colors"
                        >
                            {vm.allCurrencies.map((curr) => (
                                <option key={`tgt-${curr.code}`} value={curr.code}>
                                    {curr.flag} {curr.code} - {curr.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Calculate CTA Button */}
                <button 
                    type="submit"
                    disabled={vm.isLoading}
                    className="w-full py-3 bg-black dark:bg-zinc-100 dark:text-zinc-900 text-white border-none rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {vm.isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin inline-block"/>
                            Fetching Exchange Rates...
                        </>
                    ) : (
                        "Calculate Exchange Rate"
                    )}
                </button>
            </form>

            {/* Error Message Section */}
            {vm.error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                    ⚠️ {vm.error}
                </div>
            )}

            {/* Result Value Box */}
            {vm.convertedValue !== null && !vm.isLoading && (
                <div className="mt-5 flex flex-col gap-3">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex flex-col md:flex-row justify-between md:items-center border border-purple-100 dark:border-purple-900/30 gap-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wide">
                                Converted Value
                            </span>
                            <span className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-1">
                                {vm.amount} {vm.sourceCurrency} = {vm.convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {vm.targetCurrency}
                            </span>
                        </div>
                        <div className="text-left md:text-right flex flex-col justify-center">
                            <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                                Rate mapping
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mt-0.5">
                                1 {vm.sourceCurrency} = {vm.exchangeRate?.toFixed(4)} {vm.targetCurrency}
                            </span>
                        </div>
                    </div>

                    {/* Explanatory Triangulation details to increase depth of UI */}
                    {vm.sourceCurrency !== "EUR" && vm.targetCurrency !== "EUR" && (
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 text-[11px] text-gray-600 dark:text-zinc-400 leading-relaxed font-mono">
                            <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">🔀 Triangulation Formula (EUR Hub):</span>
                            1 {vm.sourceCurrency} ➔ (1 / EUR Base Rate) EUR ➔ Target Value
                            <br/>
                            This rate is calculated by matching cross rates through our European Central Bank (EUR) endpoint because {vm.sourceCurrency} rates are routed via intermediate hub connections.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CurrencyConverterView;
