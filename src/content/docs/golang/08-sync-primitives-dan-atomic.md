---
title: "08. Sync Primitives, sync.Pool & Atomic Operations"
description: sync.Mutex vs RWMutex, sync.WaitGroup pitfalls, sync.Once singleton, reduksi beban GC dengan sync.Pool, sync.Cond, dan lock-free sync/atomic di Go.
---

# 🐹 Golang - Modul 08: Sync Primitives, sync.Pool & Atomic Operations

Meskipun Go mempopulerkan Channel, untuk kasus-kasus komputasi performa tinggi, operasi *in-memory cache*, atau manipulasi counter sederhana, **sinkronisasi memori bersama (*shared-memory synchronization*) menggunakan package `sync` dan `sync/atomic` jauh lebih cepat dan hemat alokasi**.

---

## 1. `sync.Mutex` vs `sync.RWMutex`

- **`sync.Mutex`**: Kunci eksklusif mutual exclusion. Hanya 1 goroutine yang boleh memegang kunci (baik baca maupun tulis).
- **`sync.RWMutex`**: Mengizinkan **banyak goroutine membaca bersamaan (*RLock*)**, namun saat ada goroutine yang ingin menulis (*Lock*), semua pembaca baru akan diblokir hingga penulisan selesai.

```go
type SafeStorage struct {
	mu   sync.RWMutex
	data map[string]int
}

// Banyak goroutine bisa memanggil Read bersamaan tanpa blocking
func (s *SafeStorage) Read(key string) (int, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	val, ok := s.data[key]
	return val, ok
}

// Write membutuhkan kunci eksklusif mutlak
func (s *SafeStorage) Write(key string, val int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data[key] = val
}
```

> [!NOTE]
> **Starvation Mode**: Go Mutex memiliki dua mode: *Normal Mode* (FIFO dengan sedikit kompetisi spinlock untuk throughput maksimal) dan *Starvation Mode* (otomatis aktif jika ada goroutine yang menunggu lebih dari 1 milidetik untuk mencegah kehausan resource).

---

## 2. `sync.WaitGroup` & Jebakan Pitfall-nya

`sync.WaitGroup` digunakan untuk menyinkronkan penyelesaian kumpulan goroutine:

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
	// ATURAN SAKTI: wg.Add() WAJIB dipanggil di thread utama SEBELUM goroutine diluncurkan!
	wg.Add(1)
	go func(id int) {
		defer wg.Done() // wg.Done() mengurangi counter sebesar 1
		proses(id)
	}(i) // Pass loop variable secara eksplisit!
}

wg.Wait() // Blokir hingga counter kembali ke 0
```

> [!CAUTION]
> **Jebakan Fatal**: Jangan pernah memanggil `wg.Add(1)` di *dalam* body goroutine (`go func() { wg.Add(1) ... }`). Karena penjadwalan goroutine bersifat asinkron, baris `wg.Wait()` di thread utama bisa saja dieksekusi sebelum goroutine sempat memanggil `wg.Add()`, sehingga program langsung selesai sebelum pekerjaan dimulai!

---

## 3. `sync.Once`: Thread-Safe Lazy Singleton

Menjamin sebuah inisialisasi berat (koneksi database, parsing konfigurasi JSON) **hanya dieksekusi tepat satu kali**, bahkan ketika dipanggil serentak oleh 10.000 goroutine:

```go
package main

import (
	"database/sql"
	"sync"
)

var (
	dbInstance *sql.DB
	dbOnce     sync.Once
)

func GetDB() *sql.DB {
	dbOnce.Do(func() {
		// Blok ini DIJAMIN hanya berjalan 1 kali seumur hidup aplikasi!
		dbInstance = initDatabaseConnection()
	})
	return dbInstance
}
```

---

## 4. `sync.Pool`: Senjata Utama Mengurangi Beban GC

Pada aplikasi web dengan beban ratusan ribu request per detik, membuat dan membuang buffer byte (`bytes.Buffer`) berulang kali akan memicu alokasi heap jutaan kali dan membebani Garbage Collector.

`sync.Pool` menyediakan **kolam penampungan objek memori yang bisa dipakai ulang (*object recycling*)**:

```go
package main

import (
	"bytes"
	"sync"
)

// Inisialisasi pool dengan generator objek baru
var bufferPool = sync.Pool{
	New: func() interface{} {
		// Dialokasikan hanya jika kolam sedang kosong
		return new(bytes.Buffer)
	},
}

func formatLogFast(user string, action string) string {
	// 1. Ambil buffer dari pool
	buf := bufferPool.Get().(*bytes.Buffer)
	buf.Reset() // Bersihkan sisa data lama sebelum dipakai!

	// 2. Kembalikan buffer ke pool saat fungsi selesai
	defer bufferPool.Put(buf)

	// 3. Gunakan tanpa memicu alokasi heap baru!
	buf.WriteString("User [")
	buf.WriteString(user)
	buf.WriteString("] melakukan aksi: ")
	buf.WriteString(action)

	return buf.String()
}
```

> [!IMPORTANT]
> Objek di dalam `sync.Pool` bisa dibersihkan secara otomatis oleh runtime Go saat siklus Garbage Collection berjalan jika memori server sedang tertekan. Jangan pernah menyimpan state permanen di dalam pool!

---

## 5. Operasi Bebas Kunci: `sync/atomic` (Lock-Free)

Untuk counter integer sederhana, menggunakan `sync.Mutex` terlalu berat (*overkill*). Gunakan operasi tingkat instruksi CPU **Atomic (Compare-And-Swap / CAS)** yang 10x lebih cepat:

Sejak Go 1.19+, tersedia tipe data atomic modern yang aman (*type-safe*):

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

type MetrikServer struct {
	TotalRequest atomic.Int64 // Tipe atomic modern Go 1.19+
	IsHealthy    atomic.Bool
}

func main() {
	var metrik MetrikServer
	metrik.IsHealthy.Store(true)

	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			// Tambah counter secara atomik tanpa mutex!
			metrik.TotalRequest.Add(1)
		}()
	}

	wg.Wait()
	fmt.Printf("Total Request: %d (Sehat: %t)\n",
		metrik.TotalRequest.Load(),
		metrik.IsHealthy.Load(),
	)
}
```
