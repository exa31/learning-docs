---
title: "01. Sintaks Dasar & Optionals"
description: Variabel let vs var, Sound Optionals, unwrapping via if let dan guard let, serta operator nil-coalescing.
---

# 🍏 Swift - Modul 01: Sintaks Dasar & Optionals

Cheatsheet kilat bahasa Swift: bahasa modern buatan Apple untuk iOS, macOS, watchOS, dan backend dengan fokus performa dan *safety*.

---

## 1. Variabel: `let` vs `var`

- **`let`**: Nilai konstan / Immutable (tidak bisa diubah). **Gunakan ini sebagai default!**
- **`var`**: Nilai variabel / Mutable (bisa diubah-ubah).

```swift
let nama: String = "Eka"
// nama = "Budi" // ❌ Error Compiler: Cannot assign to value: 'nama' is a 'let' constant

var skor: Int = 100
skor = 150 //  Aman

// String Interpolation menggunakan \(variabel):
let pesan = "Halo \(nama), skormu adalah \(skor) poin."
print(pesan)
```

---

## 2. Optionals (Penanganan Nilai `nil` Super Aman)

Di Swift, variabel biasa **sama sekali tidak boleh bernilai `nil`**. Jika suatu data bisa saja kosong, pasang tanda tanya **`?`**:

```swift
var username: String? = "eka31"
username = nil //  Bisa karena bertipe Optional(String)
```

---

## 3. Cara Membuka Optionals (*Unwrapping*)

Jangan pernah membuka nilai optional secara paksa dengan `!` (*Force Unwrapping*) jika tidak ingin aplikasi iOS kamu crash seketika! Gunakan 3 cara elegan berikut:

### A. `guard let` (Pola Andalan Swift: Early Exit)
Mengecek data di awal fungsi. Jika nil, langsung keluar (*return*). Nilai yang sudah di-unwrap **bisa terus dipakai di sisa baris fungsi ke bawah**:

```swift
func kirimEmail(target: String?) {
    // Jika target nil, langsung batalkan fungsi:
    guard let emailValid = target else {
        print("❌ Error: Alamat email tidak boleh kosong!")
        return
    }

    // 'emailValid' otomatis bukan optional dan bisa dipakai di bawah ini:
    print("Mengirim pesan ke: \(emailValid)")
}
```

### B. `if let` (Optional Binding Lokal)
Membuka optional hanya untuk dipakai di dalam kurung kurawal `{ }` tertentu:

```swift
let token: String? = "abc-123"

if let t = token {
    print("Token valid: \(t)")
} else {
    print("Token tidak ada")
}
```

### C. Nil-Coalescing Operator (`??`)
Memberikan nilai cadangan (*default fallback*) jika nilainya `nil`:

```swift
let namaInput: String? = nil
let namaTampil = namaInput ?? "Tamu" // Bernilai "Tamu"
```

### D. Optional Chaining (`?.`)
Mencegah crash saat mengakses properti bersarang:

```swift
let jalan = user?.alamat?.namaJalan // Me-return nil tanpa crash jika salah satu nil
```
