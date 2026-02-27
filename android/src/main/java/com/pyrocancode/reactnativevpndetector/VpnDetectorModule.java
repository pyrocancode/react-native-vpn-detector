package com.pyrocancode.reactnativevpndetector;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class VpnDetectorModule extends ReactContextBaseJavaModule {

  VpnDetectorModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return "VpnDetector";
  }

  @ReactMethod
  public void isVpnActive(Promise promise) {
    try {
      ReactApplicationContext context = getReactApplicationContext();
      ConnectivityManager connectivityManager =
        (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

      if (connectivityManager == null) {
        promise.resolve(false);
        return;
      }

      boolean vpnInUse = false;
      for (Network network : connectivityManager.getAllNetworks()) {
        NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(network);
        if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
          vpnInUse = true;
          break;
        }
      }

      promise.resolve(vpnInUse);
    } catch (Exception e) {
      promise.reject("VPN_DETECT_ERROR", "Failed to detect VPN status", e);
    }
  }
}

