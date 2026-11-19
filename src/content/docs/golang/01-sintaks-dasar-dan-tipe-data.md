---
title: "01. Sintaks Dasar & Tipe Data"
description: Entrypoint package main, var vs :=, zero values, konstanta & iota, dan konversi tipe data di Go.
---

# 🐹 Golang - Modul 01: Sintaks Dasar & Tipe Data

Cheatsheet kilat bahasa Go (Golang): bahasa kompilasi statis yang cepat, sederhana, dan tanpa class.

---

## 1. Struktur Minimal Program Go

Setiap file eksekusi wajib diawali dengan `package main` dan fungsi `main()`:

```go
package main

import "fmt"

func main() {
    fmt.Println("Halo dari Golang!")
}
```

---

## 2. Deklarasi Variabel: `var` vs `:=` (Short Declaration)

- **`:=`**: Deklarasi + penugasan singkat (hanya bisa dipakai di **dalam fungsi**). Tipe data otomatis ditebak (*type inference*).
- **`var`**: Deklarasi formal (bisa di level package maupun fungsi).

```go
package main

// Di luar fungsi wajib pakai var:
var VersiApp string = "1.0.0"

func main() {
    // Short declaration (paling sering dipakai):
    nama := "Eka"
    umur := 25
    isAktif := true

    // Deklarasi tanpa nilai awal akan otomatis bernilai "Zero Value":
    var saldo int       // 0
    var namaUser string // "" (string kosong)
    var status bool     // false
}
```

---

## 3. Konstanta & `iota` (Auto-Increment Enum)

`iota` adalah generator integer berurutan otomatis yang sangat populer untuk membuat Enum di Go:

```go
package main

const (
    StatusPending = iota // 0
    StatusAktif          // 1
    StatusBanned         // 2
)
```

---

## 4. Konversi Tipe Data (Wajib Eksplisit)

Di Go, **tidak ada konversi otomatis** antar tipe numerik:

```go
var a int = 10
var b float64 = float64(a) // Wajib casting manual

// Konversi String ke Integer (dan sebaliknya) via package strconv:
import "strconv"

angka, err := strconv.Atoi("123") // String to Int
teks := strconv.Itoa(456)         // Int to String
```
