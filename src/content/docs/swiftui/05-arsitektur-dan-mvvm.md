---
title: "05. Arsitektur MVVM & API"
description: Pola Clean Architecture MVVM di SwiftUI (@Observable ViewModel, Enum UI State), fetching REST API async/await, dan mock data #Preview.
---

# 🍎 SwiftUI - Modul 05: Arsitektur MVVM & REST API

Pola arsitektur standar industri untuk aplikasi iOS berbasis SwiftUI: memisahkan tampilan deklaratif dari logika bisnis dan komunikasi jaringan (*Network Layer*).

---

## 1. Tiga Lapisan MVVM

```text
┌─────────────────┐       ┌───────────────────────┐       ┌─────────────────┐
│      Model      │ <───> │       ViewModel       │ <───> │      View       │
│  (Data Struct)  │       │  (@Observable + API)  │       │ (SwiftUI Murni) │
└─────────────────┘       └───────────────────────┘       └─────────────────┘
```

1. **Model**: Struct data murni yang mengadopsi `Codable` dan `Identifiable`.
2. **ViewModel**: Kelas `@Observable` yang memegang logika bisnis, memanggil REST API, dan mengelola state.
3. **View**: Tampilan deklaratif murni yang hanya bertugas merender data dan mengirim event aksi user ke ViewModel.

---

## 2. Implementasi Lengkap (Studi Kasus: Pengguna API)

### A. Model Data (`User.swift`)
```swift
import Foundation

struct User: Codable, Identifiable {
    let id: Int
    let name: String
    let email: String
    let username: String
}
```

### B. Pemodelan Status Layar (`UiState`)
```swift
enum UserUiState {
    case idle
    case loading
    case success([User])
    case error(String)
}
```

### C. ViewModel (`UserViewModel.swift`)
```swift
import Foundation
import Observation

@Observable
class UserViewModel {
    var state: UserUiState = .idle

    @MainActor
    func fetchUsers() async {
        state = .loading
        guard let url = URL(string: "https://jsonplaceholder.typicode.com/users") else {
            state = .error("URL tidak valid")
            return
        }

        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                state = .error("Server mengembalikan kode non-200")
                return
            }
            let users = try JSONDecoder().decode([User].self, from: data)
            self.state = .success(users)
        } catch {
            self.state = .error("Gagal terhubung: \(error.localizedDescription)")
        }
    }
}
```

### D. View Utama (`UserListScreen.swift`)
```swift
import SwiftUI

struct UserListScreen: View {
    @State private var viewModel = UserViewModel()

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.state {
                case .idle, .loading:
                    ProgressView("Sedang mengambil data...")
                case .success(let users):
                    List(users) { user in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(user.name)
                                .font(.headline)
                            Text(user.email)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                case .error(let pesan):
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(.red)
                        Text(pesan)
                        Button("Coba Lagi") {
                            Task { await viewModel.fetchUsers() }
                        }
                    }
                }
            }
            .navigationTitle("Daftar Pengguna")
            .task {
                await viewModel.fetchUsers()
            }
        }
    }
}
```

---

## 3. Mock Data untuk Xcode `#Preview`

Agar Canvas Xcode bisa langsung menampilkan tampilan tanpa perlu koneksi internet:

```swift
#Preview("Data Berhasil") {
    let vm = UserViewModel()
    vm.state = .success([
        User(id: 1, name: "Eka Pratama", email: "eka@example.com", username: "eka31"),
        User(id: 2, name: "Budi Santoso", email: "budi@example.com", username: "budi01")
    ])
    return UserListScreen()
}

#Preview("Tampilan Loading") {
    let vm = UserViewModel()
    vm.state = .loading
    return UserListScreen()
}
```
