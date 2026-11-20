---
title: "07. Ekstensi: pgvector (AI RAG), PostGIS & citext"
description: Ekstensi pgvector untuk LLM Vector Database (HNSW vs IVFFlat), pencarian spasial PostGIS, dan tipe teks case-insensitive citext di PostgreSQL.
---

# 🐘 PostgreSQL - Modul 07: Ekstensi: pgvector (AI RAG), PostGIS & citext

Salah satu keunggulan terbesar PostgreSQL dibanding database lain adalah **arsitektur plugin ekstensibel**. Kamu bisa mengubah Postgres menjadi **Vector Database untuk AI/LLM**, **GIS Engine Spasial**, atau **Search Engine** hanya dengan satu baris perintah `CREATE EXTENSION`.

---

## 1. `pgvector`: Mengubah Postgres Menjadi Vector Database AI (RAG)

Dalam era AI generatif dan sistem RAG (*Retrieval-Augmented Generation*), kamu tidak perlu membayar mahal database vektor terpisah (seperti Pinecone atau Qdrant). Ekstensi resmi **`pgvector`** menghadirkan pencarian kemiripan vektor (*Similarity Search*) langsung di dalam tabel Postgresmu.

```sql
-- Aktifkan ekstensi pgvector:
CREATE EXTENSION IF NOT EXISTS vector;

-- Buat tabel dokumen RAG dengan embedding 1536 dimensi (OpenAI text-embedding-3-small):
CREATE TABLE dokumen_ai (
    id SERIAL PRIMARY KEY,
    konten TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(1536) NOT NULL
);
```

### Operator Jarak Vektor:
- **`<=>`**: **Cosine Distance** (Paling populer untuk model bahasa dan semantic search).
- **`<->`**: **L2 Euclidean Distance** (Jarak lurus antar titik).
- **`<#>`**: **Negative Inner Product** (Dot product).

```sql
-- Mencari 5 dokumen paling mirip secara semantik dengan query vektor pengguna:
SELECT id, konten, 1 - (embedding <=> :query_vector) AS skor_kemiripan
FROM dokumen_ai
ORDER BY embedding <=> :query_vector ASC
LIMIT 5;
```

---

## 2. Indexing Vektor: HNSW vs IVFFlat

Tanpa index, pencarian vektor melakukan perbandingan menyeluruh (*K-Nearest Neighbor Sequential Scan*) yang memakan banyak CPU.

| Parameter | **HNSW (Direkomendasikan)** | **IVFFlat** |
|---|---|---|
| **Mekanisme** | Hierarchical Navigable Small World (Peta graph multi-layer). | Inverted File Flat (Mengelompokkan vektor ke dalam centroid cluster). |
| **Akurasi (Recall)** | **Sangat Tinggi ($>99\%$)** | Sedang ($90 - 95\%$) |
| **Kecepatan Query** | **Ultra Cepat** | Cepat jika dataset terdistribusi rapi |
| **Kebutuhan RAM** | Memerlukan lebih banyak RAM untuk menyimpan graph | Hemat RAM |

```sql
-- Membuat HNSW Index tercepat untuk Cosine Distance:
CREATE INDEX idx_dokumen_hnsw ON dokumen_ai 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

---

## 3. `PostGIS`: Standar Emas Geospasial Dunia

PostGIS memungkinkan kalkulasi geografi bumi nyata (GPS, radius jarak toko terdekat, poligon area pengiriman kurir):

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE toko_cabang (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100),
    -- Tipe GEOGRAPHY(Point, 4326): Koordinat GPS lintang/bujur standar WGS 84
    lokasi GEOGRAPHY(Point, 4326)
);

-- Indexing Spasial GiST (Wajib untuk performa geometri):
CREATE INDEX idx_toko_lokasi ON toko_cabang USING GIST (lokasi);

-- Mencari toko yang berada dalam RADIUS 5 KILOMETER dari posisi GPS user:
-- ST_DWithin otomatis menghitung kelengkungan bumi dalam satuan METER!
SELECT nama, ST_Distance(lokasi, ST_MakePoint(106.8271, -6.1754)::geography) AS jarak_meter
FROM toko_cabang
WHERE ST_DWithin(lokasi, ST_MakePoint(106.8271, -6.1754)::geography, 5000)
ORDER BY jarak_meter ASC;
```

---

## 4. `citext`: Teks Case-Insensitive Tanpa Lower()

Secara standar di Postgres, `'Eka'` tidak sama dengan `'eka'`. Developer sering terpaksa menulis `WHERE LOWER(email) = LOWER(:input)` dan membuat *Functional Index*.

Ekstensi **`citext`** otomatis memperlakukan perbandingan teks secara case-insensitive tanpa penalti fungsi:

```sql
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE member (
    id SERIAL PRIMARY KEY,
    username CITEXT UNIQUE NOT NULL -- Otomatis case-insensitive!
);

INSERT INTO member (username) VALUES ('EkaDev');

-- Query ini langsung COCOK dan menggunakan B-Tree index standar secara alami:
SELECT * FROM member WHERE username = 'ekadev'; -- Berhasil ditemukan!
```
