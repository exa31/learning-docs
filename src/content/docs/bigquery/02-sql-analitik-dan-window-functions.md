---
title: "02. SQL Analitik & Window Functions"
description: Eksplorasi fitur SQL analitik BigQuery tingkat lanjut, klausa QUALIFY, ekstensi SELECT *, dan fungsi agregasi hampiran HyperLogLog++.
---

# 📊 Google BigQuery - Modul 02: SQL Analitik & Window Functions

BigQuery menggunakan **GoogleSQL** (sebelumnya Standard SQL) yang mendukung standar ANSI:2011 lengkap dengan ekstensi analitik modern yang dirancang khusus untuk memproses dataset berskala miliaran baris secara efisien.

---

## 1. Window Functions Terlengkap

Window function melakukan kalkulasi terhadap sekumpulan baris (*window*) yang terkait dengan baris saat ini tanpa menggabungkan (*collapsing*) baris-baris tersebut seperti halnya `GROUP BY`.

### A. Perankingan: ROW_NUMBER, RANK, DENSE_RANK
```sql
SELECT
  user_id,
  kategori,
  total_belanja,
  -- 1. Penomoran urut tanpa seri (1, 2, 3, 4)
  ROW_NUMBER() OVER(PARTITION BY kategori ORDER BY total_belanja DESC) AS urutan_row,
  -- 2. Ranking dengan lompatan jika nilai sama (1, 2, 2, 4)
  RANK() OVER(PARTITION BY kategori ORDER BY total_belanja DESC) AS ranking_gap,
  -- 3. Ranking tanpa lompatan jika nilai sama (1, 2, 2, 3)
  DENSE_RANK() OVER(PARTITION BY kategori ORDER BY total_belanja DESC) AS dense_rank
FROM `my_project.analytics.orders`;
```

### B. Perbandingan Waktu: LAG & LEAD
Mengakses baris sebelum atau sesudah baris aktif tanpa self-join yang mahal:
```sql
SELECT
  tanggal,
  omzet_harian,
  -- Ambil omzet 1 hari sebelumnya:
  LAG(omzet_harian, 1) OVER(ORDER BY tanggal ASC) AS omzet_kemarin,
  -- Hitung persentase pertumbuhan dibanding kemarin:
  SAFE_DIVIDE(
    omzet_harian - LAG(omzet_harian, 1) OVER(ORDER BY tanggal ASC),
    LAG(omzet_harian, 1) OVER(ORDER BY tanggal ASC)
  ) * 100 AS growth_pct
FROM `my_project.analytics.daily_sales`;
```

### C. Running Total & Moving Average
```sql
SELECT
  tanggal,
  transaksi,
  -- Total kumulatif sejak hari pertama:
  SUM(transaksi) OVER(
    ORDER BY tanggal ASC
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total,
  -- Rata-rata bergerak 7 hari terakhir:
  AVG(transaksi) OVER(
    ORDER BY tanggal ASC
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM `my_project.analytics.daily_metrics`;
```

---

## 2. Klausa Sakti: QUALIFY

Di SQL tradisional (PostgreSQL/MySQL), jika Anda ingin mengambil item dengan ranking tertinggi per kategori, Anda harus membungkus query dalam Subquery atau CTE karena `WHERE` dieksekusi sebelum Window Function.

Di BigQuery, Anda cukup menggunakan klausa **`QUALIFY`**!

```sql
-- Mengambil 3 transaksi terbesar untuk setiap pengguna secara langsung:
SELECT
  user_id,
  order_id,
  amount,
  created_at
FROM `my_project.analytics.orders`
QUALIFY ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY amount DESC) <= 3;
```
> [!TIP]
> Klausa `QUALIFY` menyederhanakan kode SQL secara drastis, meningkatkan keterbacaan, dan memungkinkan engine Dremel mengoptimalkan *top-N pushdown* ke storage.

---

## 3. Ekstensi Sakti: SELECT * EXCEPT & REPLACE

Bosan harus mengetik ulang 40 nama kolom tabel saat hanya ingin mengecualikan atau mengubah format satu kolom? BigQuery menyediakan shortcut ini:

```sql
SELECT
  * EXCEPT (password_hash, api_secret), -- Ambil semua KECUALI 2 kolom sensitif ini
  REPLACE (UPPER(country_code) AS country_code) -- Modifikasi kolom tanpa deklarasi ulang
FROM `my_project.core.users`;
```

---

## 4. Fungsi Hampiran Cepat: APPROX_* (HyperLogLog++)

Menghitung `COUNT(DISTINCT user_id)` pada tabel 5 miliar baris membutuhkan waktu lama dan memori slot raksasa karena engine harus melacak setiap hash unik. Jika margin of error $\pm 1\%$ dapat diterima, gunakan **Approximate Functions**:

```sql
SELECT
  DATE(event_time) AS event_date,
  -- HyperLogLog++: 10x-50x lebih cepat dan hemat slot compute!
  APPROX_COUNT_DISTINCT(user_id) AS approx_active_users,
  -- Menghitung persentil 50 (Median), 90, dan 99 dalam 1 eksekusi:
  APPROX_QUANTILES(response_time_ms, 100)[OFFSET(50)] AS p50_latency,
  APPROX_QUANTILES(response_time_ms, 100)[OFFSET(99)] AS p99_latency
FROM `my_project.logs.api_gateway_events`
GROUP BY event_date;
```

---

## 5. User-Defined Functions (SQL & JavaScript UDF)

Jika butuh logika parsing kustom yang tidak ada di fungsi bawaan:

```sql
-- A. UDF SQL Ringkas
CREATE TEMP FUNCTION FormatRupiah(amount NUMERIC) AS (
  CONCAT('Rp ', FORMAT("%'d", CAST(amount AS INT64)))
);

-- B. UDF JavaScript (Untuk parsing regex atau string yang sangat rumit)
CREATE TEMP FUNCTION ParseUserAgent(ua STRING)
RETURNS STRING
LANGUAGE js AS r"""
  if (!ua) return "UNKNOWN";
  if (ua.includes("Android")) return "MOBILE_ANDROID";
  if (ua.includes("iPhone")) return "MOBILE_IOS";
  return "DESKTOP";
""";

SELECT
  user_id,
  FormatRupiah(total_belanja) AS nominal,
  ParseUserAgent(user_agent) AS device_type
FROM `my_project.analytics.orders`
LIMIT 10;
```
