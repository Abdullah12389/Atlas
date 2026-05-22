import React from "react";
import useViewModel from "../viewmodel/useViewModel";
import { pathVM } from "../viewmodel/path.viewmodel";

export const PathFinderView: React.FC = () => {
    // Reactively bind to pathVM using custom hook
    const vm = useViewModel(pathVM);

    const handleCompute = () => {
        vm.computePath();
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm text-left box-border">
            <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
                🗺️ Geopolitical Route Finder
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-5">
                Analyze transit connectivity and calculate overland border hops between nations using Breadth-First Search (BFS) graph routing.
            </p>

            {/* Inputs select row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                <div className="flex flex-col w-full sm:flex-1">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Origin Country
                    </label>
                    <select
                        value={vm.origin}
                        onChange={(e) => vm.setOrigin(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none cursor-pointer focus:border-blue-500 transition-colors"
                    >
                        <option value="">Select origin...</option>
                        {vm.countries.map((c) => (
                            <option key={`origin-${c.cca3}`} value={c.cca3}>
                                {c.flag || "🏳️"} {c.name.common} ({c.cca3})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-gray-400 dark:text-zinc-500 text-lg mt-4 hidden sm:block">📍</div>

                <div className="flex flex-col w-full sm:flex-1">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Destination Country
                    </label>
                    <select
                        value={vm.destination}
                        onChange={(e) => vm.setDestination(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 outline-none cursor-pointer focus:border-blue-500 transition-colors"
                    >
                        <option value="">Select destination...</option>
                        {vm.countries.map((c) => (
                            <option key={`dest-${c.cca3}`} value={c.cca3}>
                                {c.flag || "🏳️"} {c.name.common} ({c.cca3})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action buttons split row */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                <button
                    onClick={handleCompute}
                    disabled={vm.isLoading}
                    className="flex-[2] py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold text-sm cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {vm.isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                            Running BFS Solver...
                        </>
                    ) : (
                        "Compute Optimal Path"
                    )}
                </button>
            </div>

            {/* Path calculation result panel */}
            {vm.result && (
                <div className="mt-5">
                    {vm.result.error ? (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 rounded-lg text-xs font-semibold">
                            ⚠️ {vm.result.error}
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                            <h4 className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">
                                Calculated Border Hops:
                            </h4>

                            {/* Horizontal visual hop sequence */}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                {vm.result.path.map((hop, index) => (
                                    <React.Fragment key={`hop-${hop.cca3}`}>
                                        {index > 0 && <span className="text-blue-300 dark:text-blue-700 text-xs">➔</span>}
                                        <div
                                            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-transform hover:scale-105 cursor-help border ${index === 0 || index === vm.result!.path.length - 1
                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border-blue-200 dark:border-zinc-700"
                                                }`}
                                            title={`${hop.name} (${hop.cca3})`}
                                        >
                                            <span>{hop.flag}</span>
                                            <span>{hop.cca3}</span>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Trip summaries and statistics */}
                            <div className="mt-3 pt-2.5 border-t border-t-blue-100/70 dark:border-t-zinc-800 text-xs text-gray-600 dark:text-zinc-400 flex flex-col gap-1.5 font-sans">
                                <div>
                                    Total Transfers: <strong className="text-blue-600 dark:text-blue-400">{vm.result.transfersCount} borders crossed</strong>
                                </div>
                                <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                                    BFS Route traversal successfully visited {vm.result.path.length} geopolitical vertex nodes.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Adjacency list developer visualizer console */}
            <div className="mt-4 bg-zinc-900 dark:bg-black rounded-lg p-3 border border-zinc-800 dark:border-zinc-900">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-2 border-b border-zinc-800 pb-1.5">
                    <span className="font-semibold text-emerald-400">Global Adjacency Matrix Visualizer</span>
                    <span>Nodes: {vm.countries.length} connected</span>
                </div>
                <div className="font-mono text-xs text-zinc-300 whitespace-nowrap overflow-hidden text-ellipsis scrollbar-thin">
                    {"{ "}{vm.countries.slice(0, 3).map(c => `"${c.cca3}": [${c.borders?.map(b => `"${b}"`).join(", ")}]`).join(", ")}{", ... }"}
                </div>
            </div>
        </div>
    );
};

export default PathFinderView;
