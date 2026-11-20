---
title: "07. Isolates, Multi-Threading & Anti-Jank Worker Pools"
description: Perbedaan async vs threading, isolasi memori mutlak Isolates, background worker via Isolate.run(), dan komunikasi SendPort/ReceivePort di Dart.
---

# 🎯 Dart - Modul 07: Isolates, Multi-Threading & Anti-Jank Worker Pools

Banyak developer mengira `async/await` di Dart menjalankan komputasi di thread latar belakang (*multi-threading*). **SALAH BESAR!** `async/await` tetap berjalan di thread UI utama. Jika kamu melakukan komputasi berat (seperti mem-parsing file JSON 50MB atau memproses gambar), **animasi Flutter akan macet patah-patah (*Jank / Frame Drop*)**.

Untuk komputasi berat multi-core sejati, Dart menggunakan **Isolates**.

---

## 1. Konsep Inti Isolate: Zero Shared Memory

Berbeda dengan thread Java atau C++ yang berbagi memori RAM yang sama (sehingga butuh Mutex dan rentan deadlock), di Dart:
> *"Setiap Isolate memiliki **ruang memori Heap sendiri yang terisolasi 100%** dan memiliki Event Loop sendiri. Tidak ada memori yang dibagi!"*

```mermaid
flowchart LR
    subgraph MainIsolate["Main UI Isolate (HP Display)"]
        UIHeap["Heap Memori UI"]
        UILoop["UI Event Loop"]
    end

    subgraph WorkerIsolate["Background Worker Isolate (CPU Core 2)"]
        WorkerHeap["Heap Memori Terpisah"]
        WorkerLoop["Worker Event Loop"]
    end

    MainIsolate <-->|Message Passing via Ports (Bebas Lock!)| WorkerIsolate
```

---

## 2. Solusi Instan Modern: `Isolate.run()` (Dart 2.19+)

Untuk tugas komputasi berat yang bersifat satu kali jalan (misal: JSON parsing raksasa atau enkripsi password):

```dart
import 'dart:convert';
import 'dart:isolate';

// Fungsi komputasi CPU murni (Wajib berupa fungsi top-level atau static):
List<UserDTO> parseDataRaksasa(String jsonString) {
  final List<dynamic> listRaw = jsonDecode(jsonString);
  return listRaw.map((item) => UserDTO.fromJson(item)).toList();
}

// Di dalam Flutter Widget / Service:
Future<void> muatDataTanpaLag(String rawJsonFromApi) async {
  print("Memulai parsing di thread latar belakang...");

  // SAKTI: Isolate.run() otomatis membuat Isolate baru di Core CPU lain,
  // mengeksekusi komputasi, mengembalikan hasil, dan mematikan Isolate seketika!
  final hasil = await Isolate.run(() => parseDataRaksasa(rawJsonFromApi));

  print("Parsing selesai! UI HP tetap mulus 120 FPS tanpa lag sedikit pun!");
}
```

---

## 3. Long-Lived Worker: Komunikasi via `SendPort` & `ReceivePort`

Jika kamu butuh worker permanen yang terus bekerja di background (seperti pemrosesan frame kamera realtime):

```dart
import 'dart:isolate';

// Entrypoint fungsi worker Isolate:
void workerEntrypoint(SendPort sendPortKeMain) {
  // 1. Buat port penerima milik worker sendiri
  final receivePortWorker = ReceivePort();

  // 2. Kirim port pengirim worker ke thread utama
  sendPortKeMain.send(receivePortWorker.sendPort);

  // 3. Dengarkan tugas yang dikirim oleh thread utama
  receivePortWorker.listen((pesan) {
    if (pesan is int) {
      // Lakukan komputasi
      int hasil = pesan * pesan;
      // Kirim hasil kembali ke thread utama:
      sendPortKeMain.send("Kuadrat: $hasil");
    }
  });
}

void main() async {
  final receivePortMain = ReceivePort();

  // Meluncurkan Isolate:
  await Isolate.spawn(workerEntrypoint, receivePortMain.sendPort);

  // Tunggu Isolate mengirimkan SendPort-nya:
  final sendPortWorker = await receivePortMain.first as SendPort;

  // Sekarang kita bisa kirim tugas bolak-balik:
  sendPortWorker.send(42);
}
```
Karena tidak ada *shared memory*, Isolate dijamin **100% bebas dari bahaya Data Race dan Deadlock!**
