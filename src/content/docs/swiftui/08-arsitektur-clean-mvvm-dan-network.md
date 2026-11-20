---
title: "08. Arsitektur Clean MVVM, REST API & #Preview"
description: Panduan arsitektur Clean MVVM di SwiftUI, integrasi REST API async/await dengan URLSession, penanganan UI state, dan mock data pada #Preview.
---

# 🍎 SwiftUI - Modul 08: Arsitektur Clean MVVM, REST API & #Preview

Dalam proyek iOS komersial, mencampur logika pemanggilan API dan pengelolaan state langsung di dalam struct View akan membuat kode menjadi kotor (*spaghetti code*) dan mustahil diuji (*untestable*). 

Pola standar industri di iOS adalah **Clean MVVM (Model - View - ViewModel)**.

---

## 1. Diagram Alur Arsitektur Clean MVVM

```mermaid
flowchart LR
    API[REST API Backend] <-->|Async/Await URLSession| Service[APIService / Repository]
    Service <-->|Data Model DTO| VM["ViewModel (@Observable & @MainActor)"]
    VM -->|UI State (Loading / Success / Error)| View["SwiftUI View (body)"]
    View -->|User Action (Tombol Refresh)| VM
```

- **Model**: Struct data murni yang mematuhi `Codable` dan `Identifiable`.
- **Service**: Lapisan networking yang bertanggung jawab memanggil `URLSession` dan men-decode JSON.
- **ViewModel**: Kelas `@Observable` yang menjalankan fungsi bisnis di background, memegang status UI, dan mengeksekusi update di `@MainActor`.
- **View**: Struct tampilan deklaratif yang hanya bertugas me-render state dari ViewModel.

---

## 2. Implementasi Lengkap End-to-End

### A. Model Data (DTO)
```swift
import Foundation

struct UserItem: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let email: String
    let website: String
}
```

---

### B. Service Lapisan Jaringan (Network Client)
```swift
import Foundation

protocol UserServiceProtocol {
    func fetchUsers() async throws -> [UserItem]
}

class UserService: UserServiceProtocol {
    func fetchUsers() async throws -> [UserItem] {
        guard let url = URL(string: "https://jsonplaceholder.typicode.com/users") else {
            throw NetworkError.invalidURL
        }

        let (data, response) = try await URLSession.shared.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw NetworkError.serverError(statusCode: (response as? HTTPURLResponse)?.statusCode ?? 500)
        }

        return try JSONDecoder().decode([UserItem].self, from: data)
    }
}
```

---

### C. ViewModel Modern (`@Observable` & `@MainActor`)
```swift
import SwiftUI
import Observation

// Enum State UI:
enum ViewState<T> {
    case idle
    case loading
    case success(data: T)
    case error(message: String)
}

@Observable
@MainActor
class UserListViewModel {
    var state: ViewState<[UserItem]> = .idle

    private let service: UserServiceProtocol

    // Dependency Injection via Initializer:
    init(service: UserServiceProtocol = UserService()) {
        self.service = service
    }

    func loadUsers() async {
        state = .loading
        do {
            let users = try await service.fetchUsers()
            state = .success(data: users)
        } catch {
            state = .error(message: error.localizedDescription)
        }
    }
}
```

---

### D. Tampilan Layar (SwiftUI View)
```swift
struct UserListScreen: View {
    @State private var viewModel = UserListViewModel()

    var body: some View {
        NavigationStack {
            Group {
                switch viewModel.state {
                case .idle, .loading:
                    ProgressView("Mengunduh daftar pengguna...")

                case .success(let users):
                    List(users) { user in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(user.name)
                                .font(.headline)
                            Text(user.email)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .refreshable {
                        await viewModel.loadUsers()
                    }

                case .error(let pesan):
                    VStack(spacing: 16) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.system(size: 48))
                            .foregroundStyle(.red)
                        Text("Terjadi Gangguan")
                            .font(.title2).bold()
                        Text(pesan)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                        Button("Coba Lagi") {
                            Task { await viewModel.loadUsers() }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                    .padding()
                }
            }
            .navigationTitle("Daftar Pengguna")
            // Muat data saat layar pertama kali muncul:
            .task {
                if case .idle = viewModel.state {
                    await viewModel.loadUsers()
                }
            }
        }
    }
}
```

---

## 3. Mock Data untuk Canvas Preview (`#Preview`)

Salah satu keunggulan terbesar arsitektur ini adalah kemudahan membuat **Mock Data** di Canvas Preview Xcode tanpa perlu memanggil API backend sungguhan:

```swift
// 1. Buat Mock Service untuk Testing/Preview:
class MockUserService: UserServiceProtocol {
    func fetchUsers() async throws -> [UserItem] {
        return [
            UserItem(id: 1, name: "Eka Dev (Mock)", email: "eka@mock.test", website: "eka.dev"),
            UserItem(id: 2, name: "Budi Santoso", email: "budi@mock.test", website: "budi.id")
        ]
    }
}

// 2. Preview Instan di Xcode:
#Preview("Sukses State") {
    let mockVM = UserListViewModel(service: MockUserService())
    UserListScreen()
}
```
Arsitektur ini menjamin aplikasi Anda modular, terisolasi, mudah diuji unit test (*XCTest*), dan memiliki performa rendering optimal di seluruh perangkat Apple!
