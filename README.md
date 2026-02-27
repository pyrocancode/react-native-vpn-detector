# 🌐 react-native-vpn-detector

**React Native module to detect VPN connection**

## 📦 Installation

Install the package with npm or yarn:

```bash
npm install react-native-vpn-detector
# or
yarn add react-native-vpn-detector
```

On React Native 0.60+ автолинковка должна сработать автоматически. После установки не забудьте пересобрать приложение.

## ⚠️ Note

The VPN detector does not work on simulators. Please test on a real device.

## 🚀 Usage

### 🧩 `useIsVpnActive`

The `useIsVpnActive` hook lets your component reactively track whether a VPN connection is active.

```javascript
import React from "react";
import { View, Text } from "react-native";
import { useIsVpnActive } from "react-native-vpn-detector";

const App = () => {
  const isVpnActive = useIsVpnActive();

  return (
    <View>
      <Text>VPN is {isVpnActive ? "active" : "inactive"}</Text>
    </View>
  );
};
```

### 🔍 `isVpnActive`

The `isVpnActive` function checks if a VPN connection is active (one-time check).

```javascript
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { isVpnActive } from "react-native-vpn-detector";

const App = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    isVpnActive().then(setValue).catch(() => setValue(false));
  }, []);

  return (
    <View>
      <Text>VPN is {value ? "active" : "inactive"}</Text>
    </View>
  );
};
```

### 📡 `addEventListener`

The `addEventListener` function listens for changes in the VPN connection status using a lightweight polling under the hood.

```javascript
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { addEventListener } from "react-native-vpn-detector";

const App = () => {
  useEffect(() => {
    const unsubscribe = addEventListener((isVpnActive) => {
      console.log(`VPN is now ${isVpnActive ? "active" : "inactive"}`);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>Listening for VPN status changes...</Text>
    </View>
  );
};
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or enhancements.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
