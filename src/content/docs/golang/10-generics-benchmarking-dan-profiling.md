---
title: "10. Generics, Benchmarking & Profiling (pprof)"
description: Generics Go 1.18+, batasan tipe constraints dan tilde (~), Table-Driven Testing, analisis alokasi memori benchmarking, dan profiling CPU/Heap via pprof.
---

# 🐹 Golang - Modul 10: Generics, Benchmarking & Profiling (pprof)

Go 1.18 memperkenalkan **Generics (Parametric Polymorphism)** tanpa mengorbankan kecepatan kompilasi. Dipadukan dengan tooling bawaan Go yang legendaris (`go test -bench` dan `pprof`), kamu bisa menulis kode yang reusable sekaligus membedah alokasi memori hingga tingkat CPU cycle.

---

## 1. Generics di Go 1.18+: Sintaks & Constraints

Generics memungkinkan fungsi atau struct bekerja dengan tipe data berbeda secara type-safe saat kompilasi tanpa perlu *type assertion* `interface{}`:

```go
package main

import (
	"fmt"
	"golang.org/x/exp/constraints" // atau buat interface sendiri
)

// Definisi interface constraint numerik buatan sendiri
type Numeric interface {
	~int | ~int64 | ~float64 // Tilde (~) mengizinkan tipe turunan / custom type!
}

// Fungsi Generic dengan constraint Numeric
func HitungMaksimum[T Numeric](a, b T) T {
	if a > b {
		return a
	}
	return b
}

type MyCustomID int // Underlying type adalah int

func main() {
	fmt.Println(HitungMaksimum(10, 25))          // Tipe int: 25
	fmt.Println(HitungMaksimum(3.14, 2.71))      // Tipe float64: 3.14

	var id1, id2 MyCustomID = 100, 200
	fmt.Println(HitungMaksimum(id1, id2))        // Tipe MyCustomID: 200 (Berkat ~int!)
}
```

> [!NOTE]
> **Constraint Bawaan**:
> - **`any`**: Alias untuk `interface{}` (menerima tipe apapun).
> - **`comparable`**: Menjamin tipe bisa dibandingkan dengan operator `==` dan `!=` (wajib untuk tipe key pada Generic Map).

### Generic Data Structure (Contoh: Generic Stack):
```go
type Stack[T any] struct {
	elements []T
}

func (s *Stack[T]) Push(item T) {
	s.elements = append(s.elements, item)
}

func (s *Stack[T]) Pop() (T, bool) {
	if len(s.elements) == 0 {
		var zero T
		return zero, false
	}
	idx := len(s.elements) - 1
	item := s.elements[idx]
	s.elements = s.elements[:idx]
	return item, true
}
```

---

## 2. Table-Driven Unit Testing

Pola standar pengujian di Go adalah *Table-Driven Tests* yang bersih dan mudah diperluas:

```go
// kalkulator_test.go
package kalkulator

import "testing"

func TestHitungDiskon(t *testing.T) {
	tests := []struct {
		name          string
		hargaAwal     float64
		persenDiskon  int
		expectedHasil float64
	}{
		{"Normal 10%", 100000, 10, 90000},
		{"Diskon Penuh 100%", 50000, 100, 0},
		{"Tanpa Diskon 0%", 75000, 0, 75000},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hasil := HitungDiskon(tt.hargaAwal, tt.persenDiskon)
			if hasil != tt.expectedHasil {
				t.Errorf("HitungDiskon() = %v, ekspektasi: %v", hasil, tt.expectedHasil)
			}
		})
	}
}
```

---

## 3. Benchmarking & Analisis Alokasi Memori

Tooling `testing.B` mengukur kecepatan eksekusi dan jumlah alokasi heap:

```go
// string_test.go
package main

import (
	"strings"
	"testing"
)

// Uji konkatenasi string biasa
func BenchmarkStringConcat(b *testing.B) {
	b.ReportAllocs() // Wajib: Melaporkan bytes/op dan allocs/op
	for i := 0; i < b.N; i++ {
		s := ""
		for j := 0; j < 100; j++ {
			s += "a"
		}
	}
}

// Uji menggunakan strings.Builder yang efisien
func BenchmarkStringBuilder(b *testing.B) {
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		var sb strings.Builder
		sb.Grow(100) // Pre-allocate buffer kapasitas
		for j := 0; j < 100; j++ {
			sb.WriteString("a")
		}
		_ = sb.String()
	}
}
```

### Menjalankan Benchmark di Terminal:
```bash
go test -bench=. -benchmem
```

Output Benchmark:
```text
BenchmarkStringConcat-8    124231     9542 ns/op     5048 B/op     99 allocs/op
BenchmarkStringBuilder-8  1421008      812 ns/op      112 B/op      1 allocs/op
```
Hasil: `strings.Builder` **$11\times$ lebih cepat** dan memangkas alokasi dari 99 alokasi menjadi hanya 1 alokasi!

---

## 4. Profiling Aplikasi Produksi dengan `pprof`

`pprof` adalah profiler kelas dunia bawaan Go untuk mengidentifikasi *bottleneck* CPU dan kebocoran memori (memory leak).

### Mengaktifkan pprof HTTP Endpoint di Server:
```go
package main

import (
	"log"
	"net/http"
	_ "net/http/pprof" // Otomatis mendaftarkan handler /debug/pprof/
)

func main() {
	go func() {
		// Jalankan pprof di port terpisah khusus internal diagnostik
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	// Jalankan logika server aplikasi utama...
}
```

### Mengambil Profiling CPU Selama 30 Detik:
```bash
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

### Membuka Visualisasi Web Interaktif (Flame Graph):
```bash
go tool pprof -http=:8081 cpu.pprof
```
Browser akan otomatis terbuka menampilkan **Flame Graph**, visualisasi graph call-stack, dan baris kode assembly yang paling boros memakan resource CPU!
