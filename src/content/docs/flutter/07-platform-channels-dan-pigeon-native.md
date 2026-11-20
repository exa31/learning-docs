---
title: "07. Platform Channels & Type-Safe Native Interop (Pigeon)"
description: Komunikasi Dart dengan native Kotlin (Android) dan Swift (iOS) via MethodChannel, EventChannel streaming, dan generator type-safe Pigeon di Flutter.
---

# 🎨 Flutter - Modul 07: Platform Channels & Type-Safe Native Interop (Pigeon)

Ketika aplikasimu membutuhkan fitur hardware khusus yang belum tersedia di pub.dev—seperti **pembacaan sensor unik, SDK pembayaran bank lokal perbankan, fitur Kiosk Mode Android, atau Apple HealthKit di iOS**—kamu harus menjembatani kode Dart dengan platform native menggunakan **Platform Channels**.

---

## 1. Arsitektur Platform Channels

Platform Channels bekerja menggunakan pertukaran pesan biner asinkron (*BinaryMessenger*) melalui jembatan antarmuka:

```mermaid
flowchart LR
    subgraph FlutterDart["Flutter (Dart Layer)"]
        MethodChannelDart["MethodChannel('com.app/battery')"]
    end

    subgraph HostPlatform["Host Platform (Native Layer)"]
        AndroidKotlin["Android (Kotlin)\nMethodChannel Handler"]
        IOSSwift["iOS (Swift)\nFlutterMethodChannel Handler"]
    end

    MethodChannelDart <-->|Serialisasi Pesan Asinkron (StandardMessageCodec)| AndroidKotlin
    MethodChannelDart <-->|Serialisasi Pesan Asinkron (StandardMessageCodec)| IOSSwift
```

| Tipe Channel | Alur Komunikasi | Kasus Penggunaan Ideal |
|---|---|---|
| **`MethodChannel`** | **Request - Response** (Memanggil fungsi native dan menunggu hasil kembalian). | Mengambil level baterai, membuka kamera native, memverifikasi fingerprint biometrik. |
| **`EventChannel`** | **Continuous Stream** (Native memancarkan aliran data terus-menerus ke Dart). | Sensor accelerometer, pedometer langkah kaki, status perubahan sinyal Wi-Fi. |
| **`BasicMessageChannel`** | Pertukaran pesan raw data dua arah. | Pengiriman frame biner mentah. |

---

## 2. Praktik Produksi: Mengambil Level Baterai Native

### A. Sisi Dart (Flutter):
```dart
import 'package:flutter/services.dart';

class BatteryService {
  // Nama unik channel (Reverse Domain Name):
  static const platform = MethodChannel("com.eka.app/battery");

  static Future<int> ambilLevelBaterai() async {
    try {
      // Panggil fungsi 'getBatteryLevel' di sisi native:
      final int level = await platform.invokeMethod("getBatteryLevel");
      return level;
    } on PlatformException catch (e) {
      print("Gagal mengambil baterai: ${e.message}");
      return -1;
    }
  }
}
```

### B. Sisi Android Native (`MainActivity.kt` - Kotlin):
```kotlin
package com.eka.app

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import android.os.BatteryManager
import android.content.Context

class MainActivity: FlutterActivity() {
    private val CHANNEL = "com.eka.app/battery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "getBatteryLevel") {
                val bm = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
                val batLevel = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
                
                if (batLevel != -1) {
                    result.success(batLevel) // Kembalikan angka ke Dart!
                } else {
                    result.error("UNAVAILABLE", "Battery level not available.", null)
                }
            } else {
                result.notImplemented()
            }
        }
    }
}
```

### C. Sisi iOS Native (`AppDelegate.swift` - Swift):
```swift
import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(name: "com.eka.app/battery",
                                              binaryMessenger: controller.binaryMessenger)
    
    batteryChannel.setMethodCallHandler({
      (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
      guard call.method == "getBatteryLevel" else {
        result(FlutterMethodNotImplemented)
        return
      }
      
      UIDevice.current.isBatteryMonitoringEnabled = true
      let batteryLevel = Int(UIDevice.current.batteryLevel * 100)
      result(batteryLevel) // Kembalikan angka ke Dart!
    })

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

---

## 3. Komunikasi Type-Safe Modern: `Pigeon` (Google Official)

Menulis string nama method manual seperti di atas rentan terhadap typo dan tidak aman (*Stringly-typed*).

**Pigeon** adalah alat resmi dari Google yang memungkinkanmu menulis satu definisi skema antarmuka di Dart, lalu Pigeon **secara otomatis men-generate kode Kotlin dan Swift yang type-safe 100%**:

```dart
// pigeons/messages.dart
import 'package:pigeon/pigeon.dart';

class PesananNative {
  String? id;
  double? nominal;
}

@HostApi()
abstract class PaymentHostApi {
  bool prosesPembayaran(PesananNative pesanan);
}
```
Jalankan `dart run pigeon` untuk menghasilkan binding otomatis tanpa perlu menulis `setMethodCallHandler` manual!
