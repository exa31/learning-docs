---
title: "06. Stored Procedures, Functions, Triggers & Views"
description: Panduan pemrograman server-side di MySQL dengan Stored Procedures, UDF Functions, Triggers untuk audit trail log, dan Views dengan CHECK OPTION.
---

# 🐬 MySQL - Modul 06: Stored Procedures, Functions, Triggers & Views

Meskipun logika bisnis modern seringkali diletakkan di layer backend aplikasi, kemampuan menjalankan kode langsung di dalam database engine (*Stored Programs*) sangat berharga untuk otomasi pemeliharaan data, integritas audit log, dan eksekusi batch berkecepatan tinggi tanpa bolak-balik jaringan.

---

## 1. Stored Procedures

Stored Procedure adalah kumpulan perintah SQL yang dikompilasi dan disimpan di server database, dapat menerima parameter input (`IN`), output (`OUT`), dan input-output (`INOUT`).

### Mengapa Perlu Mengubah `DELIMITER`?
Secara default, MySQL menganggap titik koma (`;`) sebagai tanda akhir perintah. Di dalam procedure, kita memiliki banyak titik koma. Oleh karena itu, kita harus mengganti delimiter sementara (misal menjadi `//` atau `$$`):

```sql
DELIMITER //

CREATE PROCEDURE TransferDana(
  IN p_pengirim_id INT,
  IN p_penerima_id INT,
  IN p_nominal DECIMAL(15, 2),
  OUT p_status_code VARCHAR(50)
)
BEGIN
  -- 1. Tangani Error Exception Otomatis: Rollback jika ada kegagalan SQL!
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_status_code = 'FAILED_ERROR_SQL';
  END;

  -- 2. Mulai Transaksi
  START TRANSACTION;

  -- 3. Cek apakah saldo pengirim cukup
  IF (SELECT saldo FROM accounts WHERE id = p_pengirim_id FOR UPDATE) < p_nominal THEN
    SET p_status_code = 'FAILED_INSUFFICIENT_FUNDS';
    ROLLBACK;
  ELSE
    -- 4. Kurangi saldo pengirim
    UPDATE accounts SET saldo = saldo - p_nominal WHERE id = p_pengirim_id;

    -- 5. Tambah saldo penerima
    UPDATE accounts SET saldo = saldo + p_nominal WHERE id = p_penerima_id;

    -- 6. Commit transaksi
    COMMIT;
    SET p_status_code = 'SUCCESS';
  END IF;
END //

DELIMITER ;
```

### Menjalankan Procedure:
```sql
CALL TransferDana(101, 202, 50000.00, @hasil_status);
SELECT @hasil_status; -- Menghasilkan: 'SUCCESS'
```

---

## 2. Stored Functions (UDF)

Berbeda dengan Stored Procedure yang dipanggil via `CALL`, Stored Function dipanggil langsung di dalam query `SELECT` atau `WHERE` dan **wajib mengembalikan satu nilai skalar**.

```sql
DELIMITER //

CREATE FUNCTION FormatRupiah(p_angka DECIMAL(15, 2))
RETURNS VARCHAR(50)
DETERMINISTIC
NO SQL
BEGIN
  RETURN CONCAT('Rp ', FORMAT(p_angka, 0, 'id_ID'));
END //

DELIMITER ;

-- Pemanggilan dalam query:
SELECT nama, FormatRupiah(saldo) AS saldo_formatted FROM accounts;
```
> [!NOTE]
> Kata kunci **`DETERMINISTIC`** memberi tahu optimizer bahwa fungsi akan selalu menghasilkan output yang sama jika diberi input yang sama. Jika fungsi membaca data dari tabel, gunakan **`READS SQL DATA`**.

---

## 3. Database Triggers: Audit Trail Log Otomatis

Trigger adalah blok kode yang otomatis dieksekusi oleh MySQL saat terjadi peristiwa **`INSERT`**, **`UPDATE`**, atau **`DELETE`** pada sebuah tabel.

### Kasus Nyata: Tabel Audit Trail (Mencatat Siapa Mengubah Saldo)
```sql
-- 1. Buat tabel penampung riwayat audit
CREATE TABLE account_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  old_saldo DECIMAL(15,2),
  new_saldo DECIMAL(15,2),
  diubah_oleh VARCHAR(100),
  waktu_perubahan TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buat Trigger AFTER UPDATE
DELIMITER //

CREATE TRIGGER trg_audit_saldo_update
AFTER UPDATE ON accounts
FOR EACH ROW
BEGIN
  -- Hanya catat jika saldo benar-benar berubah!
  IF OLD.saldo <> NEW.saldo THEN
    INSERT INTO account_audit_logs (account_id, old_saldo, new_saldo, diubah_oleh)
    VALUES (OLD.id, OLD.saldo, NEW.saldo, CURRENT_USER());
  END IF;
END //

DELIMITER ;
```

- **`OLD.kolom`**: Nilai baris **sebelum** modifikasi.
- **`NEW.kolom`**: Nilai baris **setelah** modifikasi (hanya ada pada `INSERT` dan `UPDATE`).

> [!WARNING]
> Jangan meletakkan operasi jaringan, email, atau komputasi lambat di dalam Trigger! Karena trigger berjalan di dalam transaksi yang sama, memperlambat trigger akan memperlambat seluruh proses `INSERT/UPDATE` aplikasi Anda.

---

## 4. Views & WITH CHECK OPTION

View adalah query tersimpan yang dapat diperlakukan layaknya tabel virtual.

```sql
-- Membuat View untuk menyembunyikan data sensitif gaji karyawan:
CREATE OR REPLACE VIEW v_karyawan_publik AS
SELECT 
  id, 
  nama, 
  email, 
  departemen
FROM karyawan
WHERE status = 'ACTIVE';

-- Query View:
SELECT * FROM v_karyawan_publik WHERE departemen = 'Engineering';
```

### Keajaiban `WITH CHECK OPTION`
Jika Anda membuat View yang dapat di-update (*Updatable View*), pasang `WITH CHECK OPTION` agar client tidak bisa memasukkan data yang melanggar filter View tersebut:

```sql
CREATE OR REPLACE VIEW v_admin_users AS
SELECT id, nama, role 
FROM users 
WHERE role = 'ADMIN'
WITH CHECK OPTION;

-- Query ini akan DITOLAK oleh MySQL:
-- ERROR 1369 (HY000): CHECK OPTION failed 'toko_online.v_admin_users'
INSERT INTO v_admin_users (nama, role) VALUES ('Hacker', 'USER');
```
