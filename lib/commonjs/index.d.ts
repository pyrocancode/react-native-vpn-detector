export declare function isVpnActive(): Promise<boolean>;
export type VpnStatusListener = (isVpnActive: boolean) => void;
export declare function addEventListener(listener: VpnStatusListener, pollIntervalMs?: number): () => void;
export declare function useIsVpnActive(pollIntervalMs?: number): boolean | null;
declare const _default: {
    isVpnActive: typeof isVpnActive;
    addEventListener: typeof addEventListener;
    useIsVpnActive: typeof useIsVpnActive;
};
export default _default;
