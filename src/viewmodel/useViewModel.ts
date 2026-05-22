import { useState, useEffect } from "react";

interface SubscribableViewModel {
    subscribe: (callback: () => void) => () => void;
}

/**
 * Custom React Hook that subscribes functional React views to a Subscriber-based ViewModel.
 * Whenever the ViewModel updates state and triggers `notify()`, this hook triggers a re-render.
 */
export function useViewModel<T extends SubscribableViewModel>(viewModel: T): T {
    const [, setTick] = useState(0);

    useEffect(() => {
        // Subscribe to viewmodel and trigger local state update to force re-render
        const unsubscribe = viewModel.subscribe(() => {
            setTick((t) => t + 1);
        });

        // Unsubscribe automatically on component unmount
        return unsubscribe;
    }, [viewModel]);

    return viewModel;
}

export default useViewModel;
