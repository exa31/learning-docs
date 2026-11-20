---
title: "02. HCL Syntax, Variables, Locals & Outputs"
description: Anatomi sintaks HCL, Provider block version constraints, input variables dengan validation rules, locals expressions, dan outputs di Terraform.
---

# ☁️ Terraform - Modul 02: HCL Syntax, Variables, Locals & Outputs

Struktur kode Terraform ditulis menggunakan **HCL (HashiCorp Configuration Language)** yang menggabungkan kemudahan pembacaan ala JSON/YAML dengan kekuatan ekspresi komputasi pemrograman.

---

## 1. Anatomi Blok HCL & Provider

```hcl
# 1. Terraform Settings & Versi Provider
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0" # Mengizinkan update minor (5.1, 5.2), melarang breaking major v6.0
    }
  }
}

# 2. Konfigurasi Autentikasi Provider
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}
```

---

## 2. Input Variables dengan Validasi Ketat

Jangan hardcode nilai di dalam konfigurasi. Gunakan blok `variable` dengan tipe data eksplisit dan aturan validasi kustom (*custom validation blocks*):

```hcl
variable "environment" {
  type        = string
  description = "Target deployment environment"
  default     = "staging"

  # Validasi kustom: Menolak jika nilai di luar opsi yang diizinkan!
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Variabel environment hanya boleh bernilai: development, staging, atau production."
  }
}

variable "instance_count" {
  type        = number
  description = "Jumlah replika VM"
  default     = 2

  validation {
    condition     = var.instance_count >= 1 && var.instance_count <= 10
    error_message = "Jumlah VM minimal 1 dan maksimal 10 demi efisiensi biaya."
  }
}

variable "db_password" {
  type        = string
  description = "Master password database"
  sensitive   = true # SAKTI: Nilai ini disensor (dikaburkan) dari terminal & CI/CD logs!
}
```

---

## 3. Local Values (`locals`): Nilai Komputasi Bersama

Jika kamu memiliki logika penggabungan string atau perhitungan yang dipakai berulang kali, gunakan `locals` agar tidak melanggar prinsip DRY (*Don't Repeat Yourself*):

```hcl
locals {
  app_name = "learning-portal"
  
  # Format penamaan resource standar perusahaan:
  # Contoh hasil: "learning-portal-production-asia-southeast2"
  prefix_nama = "${local.app_name}-${var.environment}-${var.gcp_region}"

  # Common tags / labels untuk audit biaya cloud:
  common_labels = {
    managed_by  = "terraform"
    environment = var.environment
    project     = local.app_name
    deployed_at = timestamp()
  }
}
```

---

## 4. Output Values: Mengekspos Informasi Infrastruktur

Blok `output` berfungsi menampilkan informasi penting setelah `terraform apply` selesai dieksekusi (misal: IP publik, URL Load Balancer, atau endpoint database):

```hcl
output "server_public_ip" {
  description = "Alamat IP publik Load Balancer"
  value       = google_compute_global_forwarding_rule.lb.ip_address
}

output "database_connection_string" {
  description = "URI koneksi database untuk backend pod"
  value       = "postgres://${google_sql_user.user.name}:${var.db_password}@${google_sql_database_instance.db.private_ip_address}:5432/app_db"
  sensitive   = true # Nilai tidak akan dicetak vulgar di terminal!
}
```
Untuk mengambil nilai output yang ditandai sensitive di terminal:
```bash
terraform output -raw database_connection_string
```
