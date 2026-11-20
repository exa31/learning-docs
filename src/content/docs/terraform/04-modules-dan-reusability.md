---
title: "04. Modules, Registry & Multi-Environment Architecture"
description: Arsitektur reusable modules (Root vs Child), version pinning Git/Registry, dan layout folder multi-environment (Dev/Staging/Prod) di Terraform.
---

# ☁️ Terraform - Modul 04: Modules, Registry & Multi-Environment Architecture

Menulis semua resource (VPC, Database, Kubernetes, Storage) di dalam satu file `main.tf` raksasa adalah kesalahan arsitektur fatal. **Terraform Modules** adalah cara mengemas kumpulan resource menjadi komponen mandiri yang bisa dipakai ulang (*reusable component*).

---

## 1. Anatomi Struktur Sebuah Module Standar

Sebuah module yang baik mengikuti struktur folder mandiri:

```text
modules/database/
├── main.tf        # Deklarasi resource utama (Cloud SQL / RDS)
├── variables.tf   # Parameter input yang wajib diisi pemanggil
├── outputs.tf     # Nilai yang diekspor keluar (IP, connection string)
└── README.md      # Dokumentasi cara penggunaan
```

---

## 2. Memanggil Child Module dari Root Module

```hcl
# live/production/main.tf

module "database_transaksi" {
  # 1. Lokasi Sumber Module (Bisa path lokal, Git repo, atau Terraform Registry):
  source = "../../modules/database"

  # 2. Input Parameter ke Dalam Module:
  db_name        = "prod_transaksi"
  instance_tier  = "db-custom-4-16384" # 4 vCPU, 16GB RAM
  disk_size_gb   = 100
  backup_enabled = true

  # 3. Meneruskan variabel rahasia:
  db_password    = var.secret_db_password
}

# 4. Mengonsumsi Output dari Module:
resource "kubernetes_secret" "db_credentials" {
  metadata {
    name = "db-conn-secret"
  }
  data = {
    DB_HOST = module.database_transaksi.db_private_ip
    DB_NAME = module.database_transaksi.db_name
  }
}
```

---

## 3. Sumber Module Eksternal: Git & Terraform Registry

### A. Menggunakan Module Resmi dari Public Registry:
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1" # Selalu kunci versi spesifik (Version Pinning)!

  name = "prod-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-southeast-1a", "ap-southeast-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}
```

### B. Menggunakan Private Git Repository (Branch / Release Tag):
```hcl
module "k8s_cluster" {
  # Sintaks: git::URL?ref=TAG
  source = "git::git@github.com:perusahaan-dev/tf-modules.git//gke-cluster?ref=v2.1.0"

  cluster_name = "prod-cluster"
}
```

---

## 4. Layout Direktori Produksi Multi-Environment (Dev / Staging / Prod)

Hindari menggunakan *Terraform Workspaces* untuk memisahkan Dev dan Production jika konfigurasinya memiliki perbedaan drastis. Standar emas industri menggunakan **Pemisahan Direktori Bersih (*Clean Directory Layout*)**:

```text
my-infrastructure/
├── modules/                   # Single Source of Truth
│   ├── networking/
│   ├── kubernetes/
│   └── database/
│
└── live/                      # Konfigurasi per Environment Terisolasi
    ├── dev/
    │   ├── backend.tf         # State tersimpan di dev/terraform.tfstate
    │   ├── main.tf            # Memanggil modules dengan spek minimal (murah)
    │   └── terraform.tfvars
    ├── staging/
    │   ├── backend.tf
    │   ├── main.tf
    │   └── terraform.tfvars
    └── production/
        ├── backend.tf         # State tersimpan di prod/terraform.tfstate (Aman!)
        ├── main.tf            # Memanggil modules dengan Multi-AZ High Availability
        └── terraform.tfvars
```

> [!TIP]
> **Keunggulan Tata Letak Ini**: Jika kamu salah menjalankan `terraform destroy` di folder `dev/`, lingkungan `production` **dijamin 100% aman dan tidak tersentuh** karena memiliki file state dan backend yang terisolasi mutlak!
