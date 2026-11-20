---
title: "02. State Management Modern (@Observable vs Legacy)"
description: Evolusi State Management SwiftUI, framework Observation iOS 17 (@Observable & @Bindable), perbandingan dengan @StateObject legacy, dan 2-way binding $.
---

# 🍎 SwiftUI - Modul 02: State Management Modern (@Observable vs Legacy)

Manajemen state di SwiftUI telah mengalami revolusi besar. Sejak iOS 17 (Swift 5.9), Apple menggantikan framework lama yang berbasis Combine (`ObservableObject`, `@Published`, `@StateObject`) dengan **Observation Framework** modern yang berbasis macro **`@Observable`**.

---

## 1. Evolusi: Sistem Modern (iOS 17+) vs Sistem Legacy (iOS 13-16)

| Karakteristik | 🚀 **Modern (iOS 17+ / Swift 5.9+)** | 📦 **Legacy (iOS 13 s/d iOS 16)** |
|---|---|---|
| **Deklarasi Model** | Cukup tambahkan macro **`@Observable`**. | Wajib warisi class `ObservableObject`. |
| **Deklarasi Properti** | Variabel biasa: `var saldo: Double = 0`. | Wajib anotasi khusus: `@Published var saldo`. |
| **Inisialisasi di View** | Cukup pakai **`@State var model = ...`**. | Wajib pakai **`@StateObject var model = ...`**. |
| **Two-Way Binding** | Menggunakan wrapper **`@Bindable`**. | Menggunakan `$model.property`. |
| **Injeksi Global** | `.environment(model)` & `@Environment`. | `.environmentObject(model)` & `@EnvironmentObject`. |
| **Performa Re-render** | **Fine-grained**: Hanya re-render view yang membaca properti yang berubah! | **Coarse-grained**: Re-render SELURUH view jika ada 1 properti `@Published` berubah! |

---

## 2. State Lokal View: `@State` & `@Binding`

### A. `@State` (Kepemilikan Data Privat di View)
Gunakan `@State` untuk menyimpan nilai *Value Type* (seperti `Bool`, `String`, `Int`) yang hanya dibutuhkan oleh view tersebut:

```swift
struct CounterView: View {
    // @State mengalokasikan penyimpanan memori di luar struct view:
    @State private var counter = 0

    var body: some View {
        Button("Diklik \(counter) kali") {
            counter += 1 // Nilai berubah -> body otomatis dihitung ulang!
        }
    }
}
```

---

### B. `@Binding` & Awalan Tanda Dollar (`$`)
Ketika sub-view anak perlu membaca **DAN MENGUBAH** state yang dimiliki oleh parent view, gunakan **`@Binding`**:

```mermaid
flowchart TD
    Parent["ParentView (@State private var isAktif = false)"]
    Child["ChildToggleView (@Binding var status: Bool)"]

    Parent -->|"Passing Two-Way Binding: $isAktif"| Child
    Child -->|User Tap Saklar Toggle| Parent
    Note over Parent, Child: Keduanya tersinkronisasi 100% tanpa duplikasi data!
```

```swift
// 1. Komponen Anak (Stateless / Reusable):
struct SaklarKustom: View {
    @Binding var menyala: Bool // Tidak punya nilai sendiri, hanya meminjam!

    var body: some View {
        Toggle("Status Lampu", isOn: $menyala)
    }
}

// 2. Komponen Induk:
struct RuangTamuView: View {
    @State private var isLampuMenyala = false

    var body: some View {
        VStack {
            Text(isLampuMenyala ? "Ruangan Terang 💡" : "Ruangan Gelap 🌑")
            // Oper binding menggunakan tanda prefix $:
            SaklarKustom(menyala: $isLampuMenyala)
        }
    }
}
```

---

## 3. Pola Modern: Macro `@Observable` & `@Bindable` (iOS 17+)

```swift
import SwiftUI
import Observation

// 1. Model Data / ViewModel Modern:
@Observable
class ProfilUser {
    var nama: String = "Eka Dev"
    var email: String = "eka@dev.local"
    var isVerified: Bool = true
}

// 2. Tampilan Layar:
struct ProfilScreen: View {
    // Inisialisasi model di view cukup menggunakan @State biasa!
    @State private var user = ProfilUser()

    var body: some View {
        // Gunakan @Bindable untuk membuat two-way binding dari properti @Observable:
        @Bindable var userBinding = user

        VStack(spacing: 16) {
            Text("Profil: \(user.nama)")
                .font(.title)

            // Two-way binding ke TextField:
            TextField("Ubah Nama", text: $userBinding.nama)
                .textFieldStyle(.roundedBorder)

            Toggle("Status Verifikasi", isOn: $userBinding.isVerified)
        }
        .padding()
    }
}
```

---

## 4. Injeksi Ketergantungan Global: `@Environment`

Jika Anda ingin sebuah instance model dapat diakses di mana saja di seluruh cabang hierarki aplikasi (seperti data login user atau tema aplikasi):

```swift
// 1. Inject di Root Window Aplikasi:
@main
struct MyApp: App {
    @State private var authSession = AuthSessionModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(authSession) // Inject ke seluruh hierarki child views!
        }
    }
}

// 2. Baca di Layar Anak Mana Pun Tanpa Oper Parameter:
struct PengaturanView: View {
    // Ambil langsung dari Environment:
    @Environment(AuthSessionModel.self) private var auth

    var body: some View {
        Button("Logout (\(auth.currentUser.nama))") {
            auth.logout()
        }
    }
}
```
