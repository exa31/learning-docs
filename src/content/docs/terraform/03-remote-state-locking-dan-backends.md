---
title: "03. Remote State, State Locking (S3/GCS) & Disaster Recovery"
description: Anatomi terraform.tfstate, bahaya local state di tim, remote backend S3/DynamoDB dan GCS, mekanisme State Locking, dan force-unlock di Terraform.
---

# ☁️ Terraform - Modul 03: Remote State, State Locking (S3/GCS) & Disaster Recovery

File **`terraform.tfstate`** adalah jantung dari seluruh operasional Terraform. File ini memetakan kode deklaratif HCL milikmu dengan ID fisik resource nyata di API penyedia cloud. Menyimpan state secara lokal di laptop saat bekerja di dalam tim adalah resep pasti menuju bencana infrastruktur.

---

## 1. Mengapa Butuh Remote State Backend?

Secara default, Terraform menyimpan state di file lokal `terraform.tfstate`.

### Masalah Fatal Local State:
1. **Tidak Bisa Kolaborasi Tim**: Jika Engineer A membuat VM dari laptopnya, Engineer B tidak tahu bahwa VM itu ada. Jika Engineer B menjalankan `apply`, Terraform akan mencoba membuat VM kedua atau menghapus VM pertama!
2. **Korupsi State Simultan**: Jika dua developer atau pipeline CI/CD menjalankan `terraform apply` bersamaan, file state akan tertimpa dan korup (*State File Corruption*).
3. **Kebocoran Rahasia (Security Leak)**: Meskipun variabel ditandai `sensitive = true`, nilai password dan secret **tetap tersimpan polos (*plaintext*) di dalam file `.tfstate`**!

---

## 2. Arsitektur Remote State dengan State Locking

Solusi standar produksi adalah menyimpan state file di Object Storage cloud terpusat (AWS S3 atau Google Cloud Storage / GCS) yang dilengkapi dengan fitur **State Locking**:

```mermaid
flowchart TD
    subgraph Engineers["Developer & CI/CD Pipeline"]
        DevA["Engineer A\n(terraform apply)"]
        DevB["Engineer B\n(terraform apply)"]
    end

    LockDB["State Lock Mechanism\n(DynamoDB / GCS Native Lock)"]
    RemoteBucket["Remote Bucket Terenkripsi\n(AWS S3 / GCP Storage Bucket)"]

    DevA -->|1. Ambil Lock (Lock ID: 8821)| LockDB
    LockDB -.->|Lock Sukses| DevA
    DevA -->|2. Tulis Perubahan State| RemoteBucket

    DevB -->|Coba Ambil Lock| LockDB
    LockDB --x|3. DITOLAK: Error State Locked by Dev A!| DevB
```

---

## 3. Konfigurasi Backend Produksi

### A. Konfigurasi AWS S3 + DynamoDB (State Locking):
```hcl
terraform {
  backend "s3" {
    bucket         = "perusahaan-terraform-state-prod"
    key            = "networking/vpc.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true # Wajib: Enkripsi AES-256 di disk S3

    # Tabel DynamoDB khusus untuk mengunci state:
    dynamodb_table = "terraform-state-locks"
  }
}
```

### B. Konfigurasi Google Cloud Storage (GCS):
GCS memiliki penguncian bawaan (*native state locking*) tanpa butuh database tambahan:
```hcl
terraform {
  backend "gcs" {
    bucket = "perusahaan-tf-state-asia-southeast2"
    prefix = "kubernetes/production"
  }
}
```

---

## 4. Migrasi State & Menangani Lock Gantung (`force-unlock`)

### Migrasi dari Local State ke Remote State:
Cukup tambahkan blok `backend` ke file `main.tf`, lalu jalankan:
```bash
terraform init -migrate-state
```
Terraform akan otomatis mendeteksi state lokal dan menanyakan konfirmasi untuk menyalinnya ke bucket cloud secara otomatis!

### Menangani Lock yang Tersangkut (Gantung):
Jika laptop developer mendadak mati atau koneksi CI/CD terputus di tengah-tengah `apply`, kunci di DynamoDB/GCS mungkin belum sempat dilepas, memblokir semua eksekusi tim:

```text
Error: Error acquiring the state lock
Lock Info:
  ID:        b7c93e45-1204-4e2b-a1e4-9981249bfa81
  Path:      perusahaan-tf-state/...
  Who:       runner@github-actions-worker-3
```

**Solusi Darurat**:
Pastikan tidak ada orang lain yang sedang menjalankan apply, lalu lepaskan kunci secara paksa menggunakan ID yang tertera:
```bash
terraform force-unlock b7c93e45-1204-4e2b-a1e4-9981249bfa81
```

---

## 5. Berbagi Data Antar Proyek: `terraform_remote_state`

Sebuah tim infrastruktur jaringan (VPC) bisa mengekspos subnet ID ke tim Kubernetes tanpa menggabungkan kodenya menjadi satu:

```hcl
# Di dalam proyek EKS / GKE Kubernetes:
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "perusahaan-terraform-state-prod"
    key    = "networking/vpc.tfstate"
    region = "ap-southeast-1"
  }
}

# Gunakan output dari proyek jaringan:
resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.network.outputs.private_subnet_ids[0]
}
```
