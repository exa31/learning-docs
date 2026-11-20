---
title: "01. Mental Model & Layouts"
description: Mental model deklaratif SwiftUI (View = f(State)), View Builder some View, VStack/HStack/ZStack, hukum chaining modifiers, dan frame.
---

# 🍎 SwiftUI - Modul 01: Mental Model & Layouts

SwiftUI adalah framework UI deklaratif modern buatan Apple untuk iOS, macOS, watchOS, dan tvOS. Alih-alih membuat UI berbasis objek imperatif (seperti UIKit `UILabel` atau `UIViewController`), di SwiftUI **tampilan adalah fungsi murni dari State (`UI = f(State)`)**.

---

## 1. Struktur Dasar: Protokol `View` & `some View`

Setiap komponen UI di SwiftUI adalah sebuah `struct` yang mengadopsi protokol `View`:

```swift
import SwiftUI

struct SalamView: View {
    // Properti 'body' mendeskripsikan tampilan komponen:
    var body: some View {
        Text("Halo dari SwiftUI! 🚀")
            .font(.title2)
            .foregroundColor(.blue)
    }
}

// Preview instan di Xcode Canvas menggunakan macro #Preview:
#Preview {
    SalamView()
}
```

> 🧠 **Apa itu `some View` (Opaque Return Type)?**
> Artinya fungsi mengembalikan tipe konkret yang mengadopsi protokol `View`, tanpa kita harus menulis tipe internal yang panjang dan rumit (`ModifiedContent<Text, _EnvironmentKeyWritingModifier<Font>>`).

---

## 2. Tiga Wadah Layout Fundamental: `VStack`, `HStack`, `ZStack`

### A. `VStack` (Vertikal: Atas ke Bawah)
```swift
VStack(alignment: .leading, spacing: 8) {
    Text("MacBook Pro M3")
        .font(.headline)
    Text("Apple Silicon 14-inch")
        .font(.subheadline)
        .foregroundColor(.secondary)
}
.padding()
```

### B. `HStack` (Horizontal: Kiri ke Kanan)
```swift
HStack(spacing: 12) {
    Image(systemName: "cart.fill") // SF Symbols bawaan Apple
        .foregroundColor(.orange)
    Text("Total Keranjang")
    Spacer() // Mendorong teks harga ke ujung kanan
    Text("Rp 1.500.000")
        .bold()
}
.padding(.horizontal)
```

### C. `ZStack` (Tumpukan Kedalaman / Sumbu Z)
Menumpuk elemen di atas elemen lainnya (cocok untuk kartu bergambar atau badge notifikasi):

```swift
ZStack(alignment: .topTrailing) {
    // Lapisan 1 (Bawah): Background Kartu
    RoundedRectangle(cornerRadius: 16)
        .fill(Color.blue.gradient)
        .frame(width: 200, height: 120)

    // Lapisan 2 (Tengah): Teks Konten
    Text("Kartu Member VIP")
        .foregroundColor(.white)
        .padding()

    // Lapisan 3 (Pojok Kanan Atas): Badge
    Circle()
        .fill(Color.red)
        .frame(width: 20, height: 20)
        .offset(x: -8, y: 8)
}
```

---

## 3. Hukum Urutan Modifiers (Chaining Order Matters!)

Di SwiftUI, setiap modifier (`.padding()`, `.background()`, `.cornerRadius()`) **membungkus view yang sudah ada ke dalam view baru**. Urutan penulisan modifier sangat menentukan hasil visual:

```swift
//  BENAR: Beri padding dulu, lalu beri background (Background membungkus seluruh padding):
Text("Tombol Keren")
    .padding(16)
    .background(Color.blue)
    .foregroundColor(.white)
    .cornerRadius(10)

// ❌ SALAH: Beri background dulu, lalu padding (Background hanya membungkus teks tipis, padding di luar transparan):
Text("Tombol Keren")
    .background(Color.blue)
    .padding(16)
```

---

## 4. Pengendalian Ruang: `Spacer` & `.frame()`

- **`Spacer()`**: Elemen fleksibel yang memakan seluruh ruang kosong yang tersisa.
- **`.frame()`**: Menentukan dimensi ukuran view:

```swift
// Membuat tombol lebar penuh (Full-Width Button):
Button(action: { print("Checkout!") }) {
    Text("Lanjut ke Pembayaran")
        .bold()
        .frame(maxWidth: .infinity) // Memenuhi seluruh lebar layar
        .padding()
        .background(Color.blue)
        .foregroundColor(.white)
        .clipShape(Capsule())
}
.padding(.horizontal)
```
