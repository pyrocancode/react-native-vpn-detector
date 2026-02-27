#import <React/RCTBridgeModule.h>
#import <React/RCT_EXTERN.h>

@interface RCT_EXTERN_MODULE(VpnDetector, NSObject)

RCT_EXTERN_METHOD(isVpnActive:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

