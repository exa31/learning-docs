---
title: "03. Slice, Map & Pointer"
description: Pointer (& dan *), array vs slice, kapasitas slice make/append, dan operasi map dengan ok-idiom.
---

# 🐹 Golang - Modul 03: Slice, Map & Pointer

Cheatsheet kilat manipulasi alamat memori (Pointer), array dinamis (Slice), dan tabel hash (Map).

---

## 1. Pointer: Operator `&` vs `*`

- **`&` (Address of)**: Mengambil alamat memori dari suatu variabel.
- **`*` (Dereference)**: Mengakses atau mengubah nilai yang ada di alamat memori tersebut.

```go
angka := 10
var ptr *int = &angka // ptr menyimpan alamat memori 'angka'

fmt.Println("Alamat:", ptr)  // misal: 0xc000018098
fmt.Println("Isi:", *ptr)     // 10

// Mengubah nilai langsung di alamat memori:
*ptr = 20
fmt.Println("Angka asli ikut berubah:", angka) // 20
```

---

## 2. Array vs Slice

- **Array**: Ukurannya tetap (*fixed size*), ukuran adalah bagian dari tipenya (`[3]int` beda tipe dengan `[5]int`).
- **Slice**: Tampilan dinamis di atas array, ukurannya bisa bertambah (`[]int`). **Selalu gunakan Slice!**

```go
// 1. Deklarasi Slice:
nama := []string{"Ali", "Budi"}

// 2. Menggunakan make([]tipe, length, capacity):
angka := make([]int, 0, 5) // Panjang 0, kapasitas alokasi 5

// 3. Menambah data dengan append():
angka = append(angka, 10, 20, 30)

// 4. Memotong Slice [start:end]:
potongan := angka[1:3] // Mengambil index 1 dan 2
```

---

## 3. Map (Key-Value) & Idiom "Comma Ok"

Map di Go wajib diinisialisasi (pakai `make` atau literal) sebelum diisi, jika tidak akan crash *panic nil map*:

```go
// Inisialisasi Map:
users := make(map[string]int)
users["Ali"] = 25
users["Budi"] = 30

// Hapus Key:
delete(users, "Budi")

// Idiom "Comma Ok" (Cek apakah key beneran ada):
umur, ok := users["Siti"]
if !ok {
    fmt.Println("User Siti tidak ditemukan di dalam map!")
} else {
    fmt.Println("Umur Siti:", umur)
}
```
