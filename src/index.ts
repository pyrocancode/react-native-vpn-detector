import { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';

type VpnDetectorNativeModule = {
  isVpnActive: () => Promise<boolean>;
};

const { VpnDetector } = NativeModules as {
  VpnDetector: VpnDetectorNativeModule | undefined;
};

if (!VpnDetector) {
  throw new Error(
    '[react-native-vpn-detector] Native module "VpnDetector" is not linked. ' +
      'Make sure you have installed the package and rebuilt the app.',
  );
}

export async function isVpnActive(): Promise<boolean> {
  return VpnDetector!.isVpnActive();
}

export type VpnStatusListener = (isVpnActive: boolean) => void;

export function addEventListener(
  listener: VpnStatusListener,
  pollIntervalMs: number = 2000,
): () => void {
  let stopped = false;
  let lastValue: boolean | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
    } finally {
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

export function useIsVpnActive(pollIntervalMs: number = 2000): boolean | null {
  const [value, setValue] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const updateOnce = async () => {
      try {
        const result = await isVpnActive();
        if (mounted) {
          setValue(result);
        }
      } catch {
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

export default {
  isVpnActive,
  addEventListener,
  useIsVpnActive,
};
