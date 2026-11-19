---
title: "02. Control Flow & Fungsi"
description: If dengan short statement, for serbaguna (while replacement), switch tanpa break, dan multiple return values.
---

# 🐹 Golang - Modul 02: Control Flow & Fungsi

Cheatsheet kilat percabangan, looping, dan pembuatan fungsi di Golang.

---

## 1. Percabangan: `if` dengan Short Statement

Di Go, kamu bisa mendeklarasikan variabel lokal tepat sebelum kondisi dicek. Variabel tersebut hanya hidup di dalam blok `if...else`:

```go
// Sintaks: if inisialisasi; kondisi {}
if nilai := hitungNilai(); nilai >= 75 {
    fmt.Println("Lulus dengan nilai:", nilai)
} else {
    fmt.Println("Remedial:", nilai)
}
// Di luar blok ini, variabel 'nilai' sudah tidak ada di memori!
```

---

## 2. Looping: Hanya Ada `for` (Tidak Ada `while`)

Kata kunci `for` di Go dipakai untuk segala jenis perulangan:

```go
// A. For Klasik:
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// B. For sebagai "While":
count := 0
for count < 3 {
    count++
}

// C. For Infinite Loop:
for {
    // break jika kondisi terpenuhi
    break
}

// D. For Range (Looping Array/Slice/Map):
daftar := []string{"Apel", "Jeruk"}
for index, item := range daftar {
    fmt.Printf("%d: %s\n", index, item)
}
```

---

## 3. `switch` Otomatis Break (Bebas Lupa Break)

Di Go, setiap `case` pada `switch` **otomatis berhenti** tanpa butuh keyword `break`. Jika kamu ingin melanjutkan ke case bawahnya, gunakan `fallthrough`:

```go
role := "admin"

switch role {
case "admin", "superadmin": // Multiple match dalam 1 baris
    fmt.Println("Akses penuh")
case "member":
    fmt.Println("Akses terbatas")
default:
    fmt.Println("Akses tamu")
}
```

---

## 4. Fungsi & Multiple Return Values

Go bisa mengembalikan lebih dari satu nilai sekaligus dari dalam fungsi (sangat sering dipakai untuk `(hasil, error)`):

```go
// Fungsi dengan 2 return value:
func bagi(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("pembagi tidak boleh 0")
    }
    return a / b, nil
}

// Variadic Function (padanan vararg Kotlin / ...args JS):
func hitungTotal(angka ...int) int {
    total := 0
    for _, n := range angka {
        total += n
    }
    return total
}
```
