---
title: "04. Struct, Method & Interface"
description: Struct, komposisi (embedding) pengganti pewarisan, value vs pointer receiver, dan interface implisit di Go.
---

# 🐹 Golang - Modul 04: Struct, Method & Interface

Cheatsheet kilat pemodelan data objek di Go tanpa konsep class dan inheritance tradisional.

---

## 1. Struct (Kumpulan Data)

```go
type User struct {
    ID     int    `json:"id"`
    Nama   string `json:"name"`
    Email  string `json:"email"`
}

// Inisialisasi struct:
u := User{
    ID:   1,
    Nama: "Eka",
}
```

---

## 2. Method: Pointer Receiver vs Value Receiver

Di Go, method ditempelkan ke struct menggunakan tanda kurung receiver sebelum nama fungsi:

- **Value Receiver `(u User)`**: Menerima salinan (*copy*) data. Perubahan di dalam method **TIDAK MENGUBAH** struct aslinya.
- **Pointer Receiver `(u *User)`**: Menerima alamat memori. Perubahan di dalam method **LANGSUNG MENGUBAH** data struct aslinya!

```go
// 1. Value Receiver (Hanya baca):
func (u User) Sapa() string {
    return "Halo, " + u.Nama
}

// 2. Pointer Receiver (Ubah data):
func (u *User) GantiNama(namaBaru string) {
    u.Nama = namaBaru // Struct asli berubah!
}
```

---

## 3. Komposisi (*Struct Embedding*) Pengganti Inheritance

Go tidak mengenal kata kunci `extends`. Sebagai gantinya, tempelkan struct lain di dalamnya (*Composition over Inheritance*):

```go
type Orang struct {
    Nama string
    Umur int
}

type Karyawan struct {
    Orang   // Embedded struct: seluruh field & method Orang otomatis diwarisi
    Jabatan string
    Gaji    int
}

k := Karyawan{
    Orang:   Orang{Nama: "Budi", Umur: 28},
    Jabatan: "Software Engineer",
    Gaji:    10000000,
}

// Bisa diakses langsung:
fmt.Println(k.Nama) // "Budi" (tanpa k.Orang.Nama)
```

---

## 4. Interface (Diimplementasikan Secara Implisit)

Sebuah struct **otomatis mengimplementasikan interface** jika struct tersebut memiliki seluruh method yang diminta oleh interface, tanpa butuh kata kunci `implements`:

```go
// Definisi Interface:
type Pembayar interface {
    Bayar(jumlah int) bool
}

// Struct 1:
type BankTransfer struct{}
func (b BankTransfer) Bayar(jumlah int) bool {
    fmt.Printf("Bayar Rp %d via Transfer Bank\n", jumlah)
    return true
}

// Struct 2:
type EWallet struct{}
func (e EWallet) Bayar(jumlah int) bool {
    fmt.Printf("Bayar Rp %d via Dompet Digital\n", jumlah)
    return true
}

// Fungsi umum yang menerima interface apapun:
func ProsesCheckout(p Pembayar, nominal int) {
    p.Bayar(nominal)
}
```
