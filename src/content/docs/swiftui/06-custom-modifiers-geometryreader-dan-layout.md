---
title: "06. Custom Modifiers, GeometryReader & Layout Protocol"
description: Panduan pembuatan ViewModifier kustom, pembacaan koordinat layar dengan GeometryReader, PreferenceKeys, dan pembuatan layout kustom via Layout Protocol.
---

# 🍎 SwiftUI - Modul 06: Custom Modifiers, GeometryReader & Layout Protocol

Ketika komponen bawaan SwiftUI tidak lagi mencukupi kebutuhan desain khusus aplikasi Anda, Anda dapat membuat **Custom ViewModifier**, membaca koordinat dinamis layar dengan **`GeometryReader`**, dan membangun tata letak algoritma bebas menggunakan **`Layout` Protocol**.

---

## 1. Membuat Custom ViewModifier

Jika Anda sering menulis kombinasi 5 modifier yang sama berulang kali (seperti style kartu dengan padding, background, corner radius, dan shadow), bungkus ke dalam **`ViewModifier`**:

```swift
import SwiftUI

// 1. Definisikan struct yang mematuhi protokol ViewModifier:
struct KartuEleganModifier: ViewModifier {
    var warnaBackground: Color = Color(.systemBackground)

    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(warnaBackground)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
    }
}

// 2. Buat fungsi ekstensi pada protokol View agar pemanggilannya fluent:
extension View {
    func gayaKartuElegan(warna: Color = Color(.systemBackground)) -> some View {
        modifier(KartuEleganModifier(warnaBackground: warna))
    }
}

// 3. Penggunaan sangat ringkas di kode tampilan:
Text("Konten Berita Eksklusif")
    .gayaKartuElegan()
```

---

## 2. Membaca Ukuran & Koordinat dengan `GeometryReader`

`GeometryReader` memberikan akses ke dimensi lebar, tinggi, dan posisi relatif (*Coordinate Space*) view di layar:

```swift
struct ParallaxScrollView: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 20) {
                ForEach(1...10, id: \.self) { index in
                    GeometryReader { geo in
                        let minX = geo.frame(in: .global).minX

                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.blue)
                            // Efek rotasi 3D saat kartu di-scroll ke tepi layar:
                            .rotation3DEffect(
                                .degrees(Double(minX - 50) / -20),
                                axis: (x: 0, y: 1, z: 0)
                            )
                    }
                    .frame(width: 250, height: 200)
                }
            }
            .padding()
        }
    }
}
```

### Ruang Koordinat (*Coordinate Spaces*):
- **`.local`**: Koordinat relatif terhadap `GeometryReader` itu sendiri (ujung kiri atas adalah `(0, 0)`).
- **`.global`**: Koordinat absolut relatif terhadap seluruh jendela layar perangkat iPhone.
- **`.named("namaKustom")`**: Koordinat relatif terhadap view parent yang diberi identifier `.coordinateSpace(name: "namaKustom")`.

---

## 3. Komunikasi Anak ke Induk: `PreferenceKey`

Jika State mengalirkan data dari **Induk ke Anak**, bagaimana jika Anda ingin mengukur tinggi komponen anak lalu memberitahukannya ke parent? Gunakan **`PreferenceKey`**:

```swift
// 1. Buat Kunci Preferensi:
struct TinggiViewKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// 2. Anak membaca tingginya via GeometryReader dan mengirim ke key:
struct KomponenAnak: View {
    var body: some View {
        Text("Teks dinamis yang tingginya tidak diketahui...")
            .background(
                GeometryReader { geo in
                    Color.clear.preference(key: TinggiViewKey.self, value: geo.size.height)
                }
            )
    }
}

// 3. Induk mendengarkan perubahan nilai preferensi:
struct IndukView: View {
    @State private var tinggiAnak: CGFloat = 0

    var body: some View {
        VStack {
            KomponenAnak()
            Text("Tinggi anak yang terukur: \(Int(tinggiAnak)) pt")
        }
        .onPreferenceChange(TinggiViewKey.self) { tinggiBaru in
            tinggiAnak = tinggiBaru
        }
    }
}
```

---

## 4. Layout Protocol Kustom (iOS 16+)

Mulai iOS 16, Anda dapat membuat algoritma tata letak kustom (seperti **FlowLayout / Tag Cloud** yang otomatis membungkus elemen ke baris baru saat horizontal penuh) dengan mematuhi protokol **`Layout`**:

```swift
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    // 1. Hitung total ukuran yang dibutuhkan:
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        // Logika pengukuran lebar dan tinggi total...
        return CGSize(width: proposal.width ?? 300, height: 200)
    }

    // 2. Tempatkan posisi masing-masing subview:
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX {
                x = bounds.minX // Pindah ke baris baru
                y += size.height + spacing
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
            x += size.width + spacing
        }
    }
}

// Penggunaan FlowLayout semudah menggunakan VStack:
FlowLayout(spacing: 8) {
    Text("SwiftUI").padding(8).background(Color.gray.opacity(0.2)).clipShape(Capsule())
    Text("iOS Development").padding(8).background(Color.gray.opacity(0.2)).clipShape(Capsule())
    Text("Apple Vision Pro").padding(8).background(Color.gray.opacity(0.2)).clipShape(Capsule())
}
```
