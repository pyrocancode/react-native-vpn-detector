/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useIsVpnActive,
  addEventListener,
  isVpnActive,
} from 'react-native-vpn-detector';

function App() {
  const hookValue = useIsVpnActive();
  const [onceValue, setOnceValue] = useState<boolean | null>(null);

  useEffect(() => {
    isVpnActive()
      .then(setOnceValue)
      .catch(() => setOnceValue(false));

    const unsubscribe = addEventListener(value => {
      console.log('[example] VPN changed:', value);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.label}>Hook value:</Text>
        <Text style={styles.value}>
          {hookValue === null ? 'loading...' : hookValue ? 'active' : 'inactive'}
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>One-time check:</Text>
        <Text style={styles.value}>
          {onceValue === null
            ? 'loading...'
            : onceValue
              ? 'active'
              : 'inactive'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  block: {
    marginVertical: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
