---
title: "05. Goroutine & Channels"
description: Concurrency ringan dengan goroutine, unbuffered vs buffered channel, select statement, dan sync.WaitGroup.
---

# 🐹 Golang - Modul 05: Goroutine, Channel & Concurrency

Cheatsheet kilat fitur legendaris Golang: konkurensi super ringan yang bisa menjalankan jutaan thread bersamaan.

---

## 1. Goroutine (`go` Keyword)

Goroutine adalah green thread yang hanya memakan memori ~2KB (jauh lebih ringan dari OS thread biasa):

```go
func kirimEmail(target string) {
    fmt.Println("Mengirim email ke:", target)
}

func main() {
    // Jalankan di background tanpa menunggu selesai:
    go kirimEmail("user@example.com")
}
```

---

## 2. Channels (Pipa Komunikasi Antar-Goroutine)

Slogan terkenal Go: *"Do not communicate by sharing memory; instead, share memory by communicating."*

```go
func worker(ch chan string) {
    ch <- "Pekerjaan tuntas!" // Kirim data ke channel (operator <-)
}

func main() {
    // 1. Buat channel string:
    pesan := make(chan string)

    go worker(pesan)

    // 2. Terima data dari channel (menunggu / blocking sampai ada data masuk):
    hasil := <-pesan
    fmt.Println("Diterima:", hasil)
}
```

### Unbuffered vs Buffered Channel:
- `make(chan int)`: Unbuffered. Pengirim akan berhenti (*block*) sampai penerima siap mengambil data.
- `make(chan int, 5)`: Buffered. Pengirim bisa menumpuk hingga 5 item sebelum mulai memblokir.

---

## 3. `sync.WaitGroup` (Menunggu Sekelompok Goroutine)

Cara paling tepat menunggu beberapa goroutine selesai bekerja tanpa memakai `time.Sleep()` asal-asalan:

```go
import "sync"

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1) // Tambah antrean hitungan

        go func(id int) {
            defer wg.Done() // Kurangi hitungan saat selesai
            fmt.Printf("Worker %d selesai\n", id)
        }(i)
    }

    wg.Wait() // Tunggu sampai counter kembali ke 0
    fmt.Println("Semua worker tuntas!")
}
```

---

## 4. `select` Statement (Multiplexing Channel)

Mirip `switch`, tetapi khusus untuk menunggu beberapa channel secara bersamaan:

```go
import "time"

select {
case msg1 := <-ch1:
    fmt.Println("Pesan dari Channel 1:", msg1)
case msg2 := <-ch2:
    fmt.Println("Pesan dari Channel 2:", msg2)
case <-time.After(2 * time.Second):
    fmt.Println("Timeout! Server terlalu lama merespons.")
}
```
