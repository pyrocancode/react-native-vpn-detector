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
    // 1. Try CFNetwork scoped proxy settings (similar to Expo example)
    if let cfDict = CFNetworkCopySystemProxySettings()?.takeRetainedValue() as? [String: Any],
       let scoped = cfDict["__SCOPED__"] as? [String: Any] {
      for key in scoped.keys {
        if key.contains("tap") ||
          key.contains("tun") ||
          key.contains("ppp") ||
          key.contains("ipsec") ||
          key.contains("utun") {
          return true
        }
      }
    }

    // 2. Fallback to interface enumeration via getifaddrs
    var addressList: UnsafeMutablePointer<ifaddrs>?
    guard getifaddrs(&addressList) == 0, let firstAddress = addressList else {
      return false
    }

    defer {
      freeifaddrs(addressList)
    }

    var pointer: UnsafeMutablePointer<ifaddrs>? = firstAddress
    while let addr = pointer {
      if let name = String(validatingUTF8: addr.pointee.ifa_name) {
        if name.contains("tap") ||
          name.contains("tun") ||
          name.contains("ppp") ||
          name.contains("ipsec") ||
          name.contains("utun") {
          return true
        }
      }
      pointer = addr.pointee.ifa_next
    }

    return false
  }
}

