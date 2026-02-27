"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVpnActive = isVpnActive;
exports.addEventListener = addEventListener;
exports.useIsVpnActive = useIsVpnActive;
const react_1 = require("react");
const react_native_1 = require("react-native");
const { VpnDetector } = react_native_1.NativeModules;
if (!VpnDetector) {
    throw new Error('[react-native-vpn-detector] Native module "VpnDetector" is not linked. ' +
        'Make sure you have installed the package and rebuilt the app.');
}
async function isVpnActive() {
    return VpnDetector.isVpnActive();
}
function addEventListener(listener, pollIntervalMs = 2000) {
    let stopped = false;
    let lastValue = null;
    let timeoutId = null;
    const check = async () => {
        if (stopped) {
            return;
        }
        try {
            const value = await isVpnActive();
            if (value !== lastValue) {
                lastValue = value;
                listener(value);
            }
        }
        finally {
            if (!stopped) {
                timeoutId = setTimeout(check, pollIntervalMs);
            }
        }
    };
    timeoutId = setTimeout(check, 0);
    return () => {
        stopped = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };
}
function useIsVpnActive(pollIntervalMs = 2000) {
    const [value, setValue] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let mounted = true;
        const updateOnce = async () => {
            try {
                const result = await isVpnActive();
                if (mounted) {
                    setValue(result);
                }
            }
            catch {
                // ignore errors for now
            }
        };
        const unsubscribe = addEventListener(next => {
            if (mounted) {
                setValue(next);
            }
        }, pollIntervalMs);
        updateOnce();
        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [pollIntervalMs]);
    return value;
}
exports.default = {
    isVpnActive,
    addEventListener,
    useIsVpnActive,
};
