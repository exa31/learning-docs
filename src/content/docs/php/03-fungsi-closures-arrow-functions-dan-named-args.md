---
title: "03. Fungsi, Closures, Arrow Functions & Generators"
description: "First-Class Callables PHP 8.1, Named Arguments, Closures & lexical scope, Arrow Functions, dan efisiensi memori Generators via yield."
---

# 🐘 PHP - Modul 03: Fungsi, Closures, Arrow Functions & Generators

Fungsi di PHP adalah *first-class citizens*. Di era modern, fitur seperti **Named Arguments**, **First-Class Callables**, dan **Generators (`yield`)** memungkinkan penulisan kode yang ringkas, deklaratif, dan sangat hemat memori.

---

## 1. Named Arguments (PHP 8.0+)

Sebelum PHP 8, jika sebuah fungsi memiliki 5 parameter dan kamu hanya ingin mengubah parameter ke-5, kamu terpaksa menulis ulang seluruh parameter default ke-2, ke-3, dan ke-4.

Dengan **Named Arguments**, kamu bisa menentukan nama parameter secara eksplisit dan melompati argumen default:

```php
// Definisi fungsi dengan banyak parameter default:
function buatCookie(
    string $nama,
    string $nilai = "",
    int $expires = 0,
    string $path = "",
    string $domain = "",
    bool $secure = false,
    bool $httponly = false
): bool {
    // ...
    return true;
}

// ❌ Gaya Kuno: Wajib mengisi nilai default yang tidak relevan:
buatCookie("token_sesi", "xyz123", 0, "", "", false, true);

// ✅ Gaya Modern Named Arguments: Langsung tembak parameter yang ingin diubah!
buatCookie(
    nama: "token_sesi",
    nilai: "xyz123",
    httponly: true // Langsung tentukan parameter terakhir!
);
```

> [!TIP]
> **Refactoring Warning**: Ketika kamu menggunakan Named Arguments, nama parameter fungsi (`$nama`, `$nilai`) menjadi bagian dari *public API contract*. Mengubah nama variabel parameter di deklarasi fungsi akan memicu error di kode pemanggil!

---

## 2. First-Class Callable Syntax (PHP 8.1+)

Sebelum PHP 8.1, mereferensikan fungsi bawaan atau method objek sebagai callback membutuhkan string yang rapuh: `['Class', 'method']` atau `'strlen'`.

PHP 8.1 menghadirkan sintaks **`f(...)`** yang di-parse dan divalidasi langsung oleh compiler:

```php
$teks = ["php", "laravel", "symfony"];

// ❌ Gaya Kuno: String callback rawan typo dan tidak bisa di-autocompletion IDE:
$panjangKuno = array_map('strlen', $teks);

// ✅ Gaya Modern PHP 8.1+: First-Class Callable Syntax:
$panjangModern = array_map(strlen(...), $teks);

// Bisa digunakan pada Method Objek dan Method Statis:
class PengubahTeks {
    public static function kapital(string $str): string {
        return strtoupper($str);
    }
}

$hasil = array_map(PengubahTeks::kapital(...), $teks);
// Hasil: ["PHP", "LARAVEL", "SYMFONY"]
```

---

## 3. Variadic Functions & Argument Unpacking (`...`)

Operator `...` (Splat / Spread operator) memiliki dua fungsi: mengumpulkan argumen menjadi array di definisi fungsi, atau membongkar array menjadi argumen saat pemanggilan fungsi:

```php
// 1. Variadic Parameter: Mengumpulkan argumen tak terbatas:
function hitungTotal(float $pajak, float ...$hargaBarang): float 
{
    $subtotal = array_sum($hargaBarang);
    return $subtotal + ($subtotal * $pajak);
}

echo hitungTotal(0.11, 10000, 25000, 50000); // Pajak 11%, 3 barang

// 2. Argument Unpacking: Membongkar array ke parameter fungsi:
$koordinat = [10.5, 20.8];
function plotTitik(float $x, float $y): void {
    // ...
}

plotTitik(...$koordinat); // Setara plotTitik(10.5, 20.8)
```

---

## 4. Anonymous Functions (Closures) vs Short Arrow Functions

### A. Closures Klasik dengan Kata Kunci `use`
Closures klasik tidak memiliki akses ke variabel di luar scopenya secara otomatis. Kamu wajib mewariskan variabel luar menggunakan deklarasi `use`:

```php
$faktorPengali = 3;

$hitung = function (int $angka) use ($faktorPengali): int {
    return $angka * $faktorPengali;
};

echo $hitung(10); // Output: 30
```

### B. Short Arrow Functions (`fn() => expr`) (PHP 7.4+)
Arrow functions di PHP memiliki dua karakteristik unik:
1. **Auto-Capture By-Value**: Variabel dari scope induk otomatis dapat diakses tanpa perlu menulis kata kunci `use`.
2. **Single Expression Only**: Hanya boleh berisi satu ekspresi tunggal yang nilainya otomatis di-return.

```php
$diskonPersen = 0.2;
$hargaAsli = [100000, 200000, 500000];

// $diskonPersen otomatis terbaca di dalam arrow function:
$hargaDiskon = array_map(
    fn(int $harga): float => $harga - ($harga * $diskonPersen),
    $hargaAsli
);
// Hasil: [80000, 160000, 400000]
```

---

## 5. Efisiensi Memori Skala Raksasa: Generators & `yield`

Bayangkan kamu harus memproses file log atau CSV perbankan berukuran **5 Gigabyte**. Jika kamu membaca seluruh baris ke dalam array PHP standar, server kamu akan langsung mengalami **Fatal Error: Out of Memory**!

**Generator** menyelesaikan masalah ini dengan mengalirkan data satu per satu (*Lazy Streaming*) menggunakan kata kunci **`yield`**:

```mermaid
flowchart LR
    FileCSV["File Log Raksasa (5 GB di Disk)"] -->|Baca 1 Baris| Generator["Generator (yield)"]
    Generator -->|Kirim Baris| RAM["Memori RAM Hanya Terpakai ~2 MB!"]
    RAM -->|Selesai Proses| Generator
    Generator -->|Ambil Baris Berikutnya| FileCSV
```

### Implementasi Generator CSV Streamer:

```php
/**
 * Membaca jutaan baris CSV dengan konsumsi RAM konstan (< 5MB)
 * @return Generator<int, array<string>>
 */
function streamCsvBaris(string $pathFile): Generator 
{
    $handle = fopen($pathFile, 'r');
    if ($handle === false) {
        throw new RuntimeException("Gagal membuka file: $pathFile");
    }

    try {
        $nomorBaris = 0;
        while (($baris = fgetcsv($handle, 4096)) !== false) {
            $nomorBaris++;
            // yield membekukan eksekusi fungsi dan mengirimkan 1 baris ke pemanggil:
            yield $nomorBaris => $baris;
            // Saat pemanggil meminta baris berikutnya di foreach, eksekusi dilanjutkan dari titik ini!
        }
    } finally {
        fclose($handle); // Dijamin dieksekusi saat loop foreach selesai atau break
    }
}

// Konsumsi Generator seperti array biasa:
foreach (streamCsvBaris('/var/log/transaksi_jumbo.csv') as $barisKe => $kolom) {
    if ($kolom[2] === 'FAILED') {
        echo "Transaksi gagal di baris $barisKe: {$kolom[0]}\n";
    }
}
```

> [!NOTE]
> **Delegasi Generator dengan `yield from`**:
> Kamu bisa menggabungkan atau mendelegasikan hasil generator ke generator lain tanpa looping manual:
> ```php
> function generatorA() { yield 1; yield 2; }
> function generatorB() {
>     yield from generatorA(); // Delegasikan seluruh yield dari A
>     yield 3;
> }
> ```
