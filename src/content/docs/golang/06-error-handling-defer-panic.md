---
title: "06. Error Handling, Defer & Panic"
description: Idiom if err != nil, custom error, defer LIFO, serta penyelamatan crash dengan panic dan recover.
---

# 🐹 Golang - Modul 06: Error Handling, Defer & Panic

Cheatsheet kilat penanganan error terstruktur, eksekusi pembersihan dengan `defer`, dan penanganan `panic`.

---

## 1. Idiom Klasik: `if err != nil`

Di Go, error bukanlah exception yang dilempar (*throw*), melainkan **nilai biasa (*first-class value*)** yang dikembalikan oleh fungsi:

```go
import "errors"

func ambilUser(id int) (string, error) {
    if id <= 0 {
        return "", errors.New("id user tidak valid")
    }
    return "User_Ali", nil
}

func main() {
    user, err := ambilUser(0)
    if err != nil {
        fmt.Println("Terjadi error:", err)
        return // Hentikan eksekusi atau fallback
    }
    fmt.Println("Sukses:", user)
}
```

---

## 2. Kata Kunci `defer` (Pembersihan Resource Otomatis)

`defer` menunda eksekusi suatu baris fungsi sampai **fungsi pembungkusnya selesai dieksekusi** (selesai me-return).
- Sistem antreannya adalah **LIFO (Last In, First Out)**.

```go
func bacaFile() {
    file, err := os.Open("config.json")
    if err != nil {
        return
    }
    // Wajib: Jadwalkan penutupan file tepat setelah dibuka!
    defer file.Close()

    // Lakukan proses baca file di bawah ini...
    // Apapun yang terjadi (bahkan jika ada error), file.Close() DIJAMIN jalan!
}
```

---

## 3. `panic` dan `recover`

- **`panic`**: Menghentikan program seketika karena terjadi kesalahan fatal yang tidak bisa ditoleransi (seperti out of bounds index atau dereference pointer nil).
- **`recover`**: Menangkap `panic` agar program tidak crash (wajib dipanggil di dalam fungsi `defer`):

```go
func jalankanAman() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("🚨 Server selamat dari crash fatal! Error:", r)
        }
    }()

    // Simulasi panic fatal:
    panic("Koneksi database meledak!")
}

func main() {
    jalankanAman()
    fmt.Println("Program tetap hidup dan melanjutkan pekerjaan lainnya.")
}
```
