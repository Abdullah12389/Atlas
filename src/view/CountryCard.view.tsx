import type { Country } from "../models/types";

interface CountryCardProps {
    country: Country;
    onNeighborClick?: (neighborCode: string) => void;
    onClick?: () => void;
}

export const CountryCard = ({ country, onNeighborClick, onClick }: CountryCardProps) => {
    // Format currency details
    const currenciesString = country.currencies
        ? Object.entries(country.currencies)
              .map(([code, cur]) => `${cur.name} (${code}${cur.symbol ? ` - ${cur.symbol}` : ""})`)
              .join(", ")
        : "None documented";

    // Format languages details
    const languagesString = country.languages
        ? Object.values(country.languages).join(", ")
        : "None documented";

    // Format timezones details
    const timezonesString = country.timezones && country.timezones.length > 0
        ? country.timezones.slice(0, 2).join(", ") + (country.timezones.length > 2 ? "..." : "")
        : "N/A";

    return (
        <div 
            onClick={onClick}
            className="flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left w-full h-full min-h-[320px] cursor-pointer box-border group"
        >
            {/* Header Area */}
            <div className="flex items-center gap-3.5">
                <span className="text-4xl leading-none transition-transform duration-200 group-hover:scale-110" role="img" aria-label={`${country.name.common} Flag`}>
                    {country.flag || "🏳️"}
                </span>
                <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 m-0 truncate leading-snug">
                        {country.name.common}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-zinc-400 block mt-0.5 truncate max-w-[180px]">
                        {country.name.official}
                    </span>
                </div>
            </div>
            
            <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4 w-full" />

            {/* Core Specs */}
            <div className="flex flex-col gap-2.5 my-2">
                <div className="flex justify-between items-center text-sm gap-2">
                    <span className="text-gray-600 dark:text-zinc-400 font-medium whitespace-nowrap">💱 Currency:</span>
                    <span className="text-gray-900 dark:text-zinc-200 font-semibold truncate max-w-[160px]" title={currenciesString}>
                        {currenciesString}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm gap-2">
                    <span className="text-gray-600 dark:text-zinc-400 font-medium whitespace-nowrap">🗣️ Languages:</span>
                    <span className="text-gray-900 dark:text-zinc-200 font-semibold truncate max-w-[160px]" title={languagesString}>
                        {languagesString}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm gap-2">
                    <span className="text-gray-600 dark:text-zinc-400 font-medium whitespace-nowrap">⏰ Timezones:</span>
                    <span className="text-gray-900 dark:text-zinc-200 font-semibold truncate max-w-[160px]" title={timezonesString}>
                        {timezonesString}
                    </span>
                </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4 w-full mt-auto" />

            {/* Neighbors Block */}
            <div className="block w-full" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-400 uppercase tracking-wider block mb-2">
                    📍 Immediate Neighbors ({country.borders?.length || 0}):
                </span>
                {country.borders && country.borders.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 w-full max-h-[72px] overflow-y-auto pr-1">
                        {country.borders.map((code) => (
                            <button 
                                key={code} 
                                onClick={() => onNeighborClick && onNeighborClick(code)}
                                className="text-[11px] font-semibold bg-gray-50 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-gray-600 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-300 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 transition-colors cursor-pointer inline-block"
                            >
                                {code}
                            </button>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 dark:text-zinc-500 italic">No bordering countries (Island)</span>
                )}
            </div>
        </div>
    );
};
export default CountryCard;