import Foundation
import React
import CFNetwork

@objc(VpnDetector)
class VpnDetector: NSObject, RCTBridgeModule {

  // Name exposed to JS: NativeModules.VpnDetector
  static func moduleName() -> String! {
    return "VpnDetector"
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(isVpnActive:rejecter:)
  func isVpnActive(_ resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      let vpnActive = try Self.checkVpnStatus()
      resolve(vpnActive)
    } catch {
      reject("VPN_DETECT_ERROR", "Failed to detect VPN status", error)
    }
  }

  private static func checkVpnStatus() throws -> Bool {
    guard let cfDict = CFNetworkCopySystemProxySettings()?.takeRetainedValue() as? [String: Any],
          let scoped = cfDict["__SCOPED__"] as? [String: Any] else {
      return false
    }

    for key in scoped.keys {
      // Mirror react-native-vpn-status logic
      if key == "tap" ||
        key == "tun" ||
        key == "ppp" ||
        key == "ipsec" ||
        key == "ipsec0" ||
        key.contains("utun") ||
        key.contains("ipsec") {
        return true
      }
    }

    return false
  }
}

