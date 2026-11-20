---
title: "01. Sintaks Dasar, Type System & Mutability"
description: Entrypoint package main, var vs :=, typed vs untyped constants, iota enum, custom types vs type alias, dan variable shadowing di Go.
---

# 🐹 Golang - Modul 01: Sintaks Dasar, Type System & Mutability

Go (Golang) didesain oleh Robert Griesemer, Rob Pike, dan Ken Thompson di Google dengan prinsip: **kesederhanaan, kompilasi super cepat, type-safety statis, dan konkurensi bawaan**. Tidak ada class, tidak ada inheritance hierarki, tidak ada pointer arithmetic liar.

---

## 1. Struktur Entrypoint & Ekspor Identifiers

Setiap program Go yang dieksekusi wajib memiliki `package main` dan fungsi `main()`.

```go
package main

import (
	"fmt"
	"strings"
)

// Huruf KAPITAL di awal identifier = PUBLIC (Exported ke package lain)
const AppVersion = "2.4.0"

// Huruf KECIL di awal identifier = PRIVATE (Hanya bisa diakses di package ini)
var dbConnectionSecret = "super-secret-key"

func main() {
	pesan := strings.ToUpper("halo dari runtime go!")
	fmt.Printf("[%s] %s\n", AppVersion, pesan)
}
```

> [!IMPORTANT]
> **Aturan Aksesibilitas Go**: Tidak ada kata kunci `public`, `private`, atau `protected`. Aksesibilitas murni ditentukan oleh huruf pertama:
> - `CapitalLetter`: Di-ekspor (Public).
> - `smallLetter`: Tidak di-ekspor (Private package-level).

---

## 2. Deklarasi Variabel & Zero Value Guarantee

Go menjamin semua variabel memiliki **Zero Value** saat dialokasikan di memory. Tidak pernah ada variabel berisi nilai *garbage* acak dari RAM:

| Tipe Data | Zero Value |
|---|---|
| `int`, `int64`, `float64`, `byte`, `rune` | `0` / `0.0` |
| `bool` | `false` |
| `string` | `""` (string kosong panjang 0, bukan null) |
| Pointer (`*T`), Interface, Slice, Map, Channel, Func | `nil` |
| Struct | Nilai zero value dari setiap field-nya |

```go
package main

import "fmt"

func main() {
	// 1. var eksplisit dengan zero value
	var count int       // 0
	var isReady bool    // false
	var label string    // ""

	// 2. Short declaration operator := (Hanya di dalam block/fungsi)
	userAge := 28              // type int (otomatis di-infer)
	saldo := 1500000.75        // type float64
	nama, aktif := "Eka", true // Multi-deklarasi sekaligus

	fmt.Printf("count: %d, isReady: %t, userAge: %d, nama: %s\n", count, isReady, userAge, nama)
}
```

---

## 3. Bahaya Pitfall: Variable Shadowing

Operator `:=` di dalam block if/for bisa secara tidak sengaja mendeklarasikan variabel baru dengan nama yang sama, menutupi (*shadowing*) variabel di scope luar:

```go
package main

import "fmt"

func main() {
	status := "INITIAL"

	if true {
		// PERINGATAN: Menggunakan := membuat variabel status BARU di scope block if ini!
		status, err := jalankanTask()
		_ = err
		fmt.Println("Di dalam if:", status) // "SUCCESS"
	}

	// Variabel status di scope luar TIDAK BERUBAH!
	fmt.Println("Di luar if:", status) // Masih "INITIAL" (Bug halus!)
}

func jalankanTask() (string, error) {
	return "SUCCESS", nil
}
```

> [!TIP]
> **Solusi**: Jika ingin menugaskan kembali ke variabel scope luar, deklarasikan variabel error sebelumnya atau gunakan `=` alih-alih `:=`.

---

## 4. Typed vs Untyped Constants & `iota` Enum

Konstanta di Go bersifat *compile-time constants* dan memiliki presisi matematika arbitrary:

```go
package main

import "fmt"

// Untyped constant: belum terikat tipe data hingga digunakan
const MaxBuffer = 1024

// Typed constant: terikat secara kaku
const TimeoutSec int = 30

// IOTA: Generator enum otomatis berbasis index baris
type OrderStatus int

const (
	StatusPending OrderStatus = iota // 0
	StatusPaid                       // 1
	StatusShipped                    // 2
	StatusDelivered                  // 3
	StatusCanceled                   // 4
)

// Bitmask Permissions menggunakan iota bit-shift (<<)
type Permission uint

const (
	PermRead   Permission = 1 << iota // 1 << 0 = 1 (0001)
	PermWrite                         // 1 << 1 = 2 (0010)
	PermExecute                       // 1 << 2 = 4 (0100)
	PermAdmin                         // 1 << 3 = 8 (1000)
)

func main() {
	var userPerm Permission = PermRead | PermWrite // 0011 (3)
	canWrite := (userPerm & PermWrite) != 0

	fmt.Printf("Status Order: %d\n", StatusPaid)
	fmt.Printf("User Can Write: %t (Perm: %04b)\n", canWrite, userPerm)
}
```

---

## 5. Custom Type Definition vs Type Alias

Go 1.9 memperkenalkan perbedaan kritis antara `type Baru Asli` dengan `type Alias = Asli`:

```go
package main

import "fmt"

// 1. Custom Type Definition (Tipe baru dengan Type Identity sendiri)
type UserID int64
type OrderID int64

// 2. Type Alias (Nama lain untuk tipe yang sama, interoperable langsung)
type NanoSeconds = int64

func prosesUser(id UserID) {
	fmt.Println("Proses user:", id)
}

func main() {
	var uid UserID = 1001
	var oid OrderID = 1001
	var durasi NanoSeconds = 500000

	prosesUser(uid) // Valid

	// Compile Error: Cannot use oid (type OrderID) as type UserID
	// prosesUser(oid)

	// Casting eksplisit diperbolehkan jika underlying type sama:
	prosesUser(UserID(oid))

	// Type alias bisa langsung ditugaskan tanpa casting:
	var rawInt int64 = durasi
	fmt.Println("Raw Int:", rawInt)
}
```

---

## 6. Formatting Strings (`fmt.Printf` Cheat Sheet)

Dalam debugging dan logging Go, pahami verb format berikut:

```go
type Hero struct {
	Name  string
	Power int
}

h := Hero{Name: "Gundala", Power: 95}

fmt.Printf("%v\n", h)   // Nilai default: {Gundala 95}
fmt.Printf("%+v\n", h)  // Lengkap nama field: {Name:Gundala Power:95}
fmt.Printf("%#v\n", h)  // Sintaks kode Go lengkap: main.Hero{Name:"Gundala", Power:95}
fmt.Printf("%T\n", h)   // Nama tipe data: main.Hero
fmt.Printf("%p\n", &h)  // Pointer memory address: 0xc000018090
fmt.Printf("%08b\n", 5) // Binary dengan padding 8 digit: 00000101
```
