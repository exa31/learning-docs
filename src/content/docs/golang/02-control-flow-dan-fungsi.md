---
title: "02. Control Flow, Fungsi Lanjutan & Defer"
description: If initialization statement, type switch, range value copying traps, multiple & naked returns, variadic functions, closures, dan LIFO defer semantics.
---

# 🐹 Golang - Modul 02: Control Flow, Fungsi Lanjutan & Defer

Go menyederhanakan alur kontrol: **hanya ada satu kata kunci perulangan (`for`)**, switch yang otomatis `break`, dan fungsi sebagai first-class citizen dengan dukungan multi-return.

---

## 1. If dengan Initialization Statement

Go mengizinkan eksekusi satu *statement pendek* sebelum evaluasi kondisi boolean. Variabel yang dibuat hanya hidup di dalam blok `if` dan `else`:

```go
package main

import (
	"errors"
	"fmt"
)

func cariUser(id int) (string, error) {
	if id == 1 {
		return "Eka Developer", nil
	}
	return "", errors.New("user tidak ditemukan")
}

func main() {
	// Variabel 'nama' dan 'err' diinisialisasi, lalu 'err != nil' dievaluasi
	if nama, err := cariUser(1); err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Printf("User ditemukan: %s\n", nama)
	}

	// Di baris ini, 'nama' dan 'err' sudah keluar dari scope memory stack!
}
```

---

## 2. Ragam Switch: Tagless Switch & Type Switch

### A. Switch Tanpa Tag (Pengganti `if - else if` Panjang)
```go
skor := 85

switch {
case skor >= 90:
	fmt.Println("Grade: A")
case skor >= 80:
	fmt.Println("Grade: B") // Otomatis berhenti di sini (tanpa butuh 'break')
case skor >= 70:
	fmt.Println("Grade: C")
default:
	fmt.Println("Grade: F")
}
```

> [!NOTE]
> Go secara default **tidak tembus** ke case bawahnya (*no automatic fallthrough*). Jika kamu sengaja ingin tembus ke case berikutnya, gunakan kata kunci eksplisit `fallthrough`.

### B. Type Switch (Mendeteksi Tipe Konkret Interface)
```go
func jelaskanTipe(i interface{}) {
	switch v := i.(type) {
	case int:
		fmt.Printf("Integer dengan kuadrat: %d\n", v*v)
	case string:
		fmt.Printf("String dengan panjang: %d karakter\n", len(v))
	case bool:
		fmt.Printf("Boolean bernilai: %t\n", v)
	case []byte:
		fmt.Printf("Byte slice sebesar %d bytes\n", len(v))
	default:
		fmt.Printf("Tipe tidak dikenal: %T\n", v)
	}
}
```

---

## 3. The Only Loop: Ragam `for` di Go

Go tidak memiliki keyword `while` atau `do-while`. Semua di-handle oleh `for`:

```go
// 1. Classic C-style 3 komponen
for i := 0; i < 5; i++ {
	// ...
}

// 2. While-style (Hanya ada kondisi)
n := 10
for n > 0 {
	n /= 2
}

// 3. Infinite loop (biasa dipakai pada worker daemon / event listener)
for {
	if stopConditionMet() {
		break // atau return
	}
}
```

### ⚠️ Bahaya Fatal: Range Loop Value Copying
Dalam `for index, value := range slice`, variabel `value` adalah **salinan nilai (copy)**, bukan referensi ke elemen asli!

```go
type Rekening struct {
	Saldo int
}

daftar := []Rekening{{Saldo: 100}, {Saldo: 200}}

// SALAH: Mengubah 'r' tidak akan mengubah slice asli!
for _, r := range daftar {
	r.Saldo += 50 // Hanya memodifikasi variabel copy sementara di stack
}
fmt.Println(daftar[0].Saldo) // Tetap 100!

// BENAR: Akses langsung via index
for i := range daftar {
	daftar[i].Saldo += 50
}
fmt.Println(daftar[0].Saldo) // Berhasil jadi 150!
```

---

## 4. Fungsi: Multiple Returns & Named Returns

### Multiple Returns (Pola Standar Go `(result, error)`)
```go
func bagi(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("tidak bisa membagi angka dengan nol")
	}
	return a / b, nil
}
```

### Named Return Values & Naked Return
Nilai kembalian dapat dinamai saat deklarasi. Nama tersebut otomatis dialokasikan sebagai variabel di awal fungsi dengan zero value:

```go
func kalkulasiStatistik(data []int) (total int, rataRata float64) {
	if len(data) == 0 {
		return // Naked return: otomatis me-return total (0) & rataRata (0.0)
	}

	for _, v := range data {
		total += v
	}
	rataRata = float64(total) / float64(len(data))
	return // Otomatis mengembalikan nilai total dan rataRata
}
```

> [!CAUTION]
> Hindari *naked returns* pada fungsi yang panjang (> 10-15 baris) karena dapat mengaburkan kode (*readability nightmare*).

---

## 5. Variadic Functions & Slice Spreading

Fungsi dapat menerima jumlah argumen dinamis menggunakan sintaks ellipsis `...T`:

```go
func jumlahkan(pengali int, angka ...int) int {
	total := 0
	for _, a := range angka {
		total += a
	}
	return total * pengali
}

func main() {
	// Panggilan langsung
	res1 := jumlahkan(2, 10, 20, 30) // 120

	// Spreading slice ke parameter variadic
	koleksi := []int{5, 15, 25}
	res2 := jumlahkan(3, koleksi...) // 135
}
```

---

## 6. Closures: Mengikat State Lexical

Fungsi di Go dapat mengembalikan fungsi anonim yang mempertahankan state (*lexical scope*):

```go
func buatGeneratorID(prefix string) func() string {
	counter := 0
	return func() string {
		counter++ // Variabel counter di-capture dan hidup selama closure ada
		return fmt.Sprintf("%s-%04d", prefix, counter)
	}
}

func main() {
	genUser := buatGeneratorID("USR")
	fmt.Println(genUser()) // "USR-0001"
	fmt.Println(genUser()) // "USR-0002"
}
```

---

## 7. `defer`: LIFO Semantics & Evaluasi Argumen

Kata kunci `defer` menunda eksekusi statement hingga fungsi pembungkusnya selesai (*return*).

### 3 Hukum Utama Defer di Go:
1. **LIFO (Last-In First-Out)**: Defer yang didaftarkan terakhir akan dieksekusi pertama kali (seperti tumpukan piring).
2. **Immediate Evaluation**: Argumen fungsi yang di-defer **dievaluasi seketika saat baris defer dibaca**, bukan saat fungsi dieksekusi.
3. **Bisa Memodifikasi Named Return**: Defer function closure dapat membaca dan mengubah nilai named return sebelum benar-benar keluar ke pemanggil.

```go
func demoDefer() (hasil int) {
	defer func() {
		fmt.Println("1. Defer pertama dieksekusi terakhir")
	}()

	defer func() {
		fmt.Println("2. Defer kedua dieksekusi kedua")
		hasil += 10 // Memodifikasi named return 'hasil'
	}()

	angka := 42
	defer fmt.Printf("3. Nilai angka saat baris defer dibaca: %d\n", angka) // Dievaluasi sekarang (42)

	angka = 100
	return 5
}

func main() {
	res := demoDefer()
	fmt.Println("Hasil akhir:", res) // Output: 15 (5 + 10)
}
```
Output terminal:
```text
3. Nilai angka saat baris defer dibaca: 42
2. Defer kedua dieksekusi kedua
1. Defer pertama dieksekusi terakhir
Hasil akhir: 15
```
