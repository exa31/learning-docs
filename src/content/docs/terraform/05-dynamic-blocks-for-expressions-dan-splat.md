---
title: "05. Dynamic Blocks, for_each, for Expressions & Splat (*)"
description: Perbedaan count vs for_each, blok bersarang dynamic, transformasi list/map via for expressions, dan operator splat [*] di Terraform.
---

# ☁️ Terraform - Modul 05: Dynamic Blocks, for_each, for Expressions & Splat (*)

HCL menyediakan fitur perulangan dan manipulasi koleksi tingkat lanjut yang memungkinkan pembuatan puluhan resource infrastruktur yang dinamis dan terkonfigurasi otomatis.

---

## 1. Perang Meta-Arguments: `count` vs `for_each`

### A. Bahaya Tersembunyi `count` (Index-Based)
`count` mengidentifikasi resource berdasarkan nomor urut indeks array (`[0]`, `[1]`, `[2]`):

```hcl
variable "users" {
  default = ["alice", "bob", "charlie"]
}

resource "aws_iam_user" "user" {
  count = length(var.users)
  name  = var.users[count.index]
}
```

> [!CAUTION]
> **Jebakan Fatal `count`**: Jika kamu menghapus `"alice"` dari list di atas:
> - `var.users[0]` sekarang menjadi `"bob"`.
> - Terraform mengira resource `[0]` berubah nama dari "alice" ke "bob", sehingga **Terraform akan menghapus Bob lalu membuat ulang Charlie!**
> 
> **Gunakan `count` HANYA untuk toggle kondisional on/off**:
> ```hcl
> resource "aws_instance" "bastion" {
>   count = var.enable_bastion_host ? 1 : 0 # Jika false, count = 0 (Tidak dibuat)
> }
> ```

### B. `for_each` (Key-Based: Standar Emas Produksi)
`for_each` mengidentifikasi resource berdasarkan **String Key unik**, bukan nomor indeks. Menghapus satu elemen di tengah **tidak akan mengganggu resource lain**:

```hcl
variable "server_roles" {
  type = map(string)
  default = {
    web = "t3.medium"
    api = "t3.large"
    db  = "t3.xlarge"
  }
}

resource "aws_instance" "server" {
  for_each      = var.server_roles
  instance_type = each.value # t3.medium, t3.large, dll.
  tags = {
    Name = "server-${each.key}" # server-web, server-api
  }
}
```

---

## 2. Dynamic Blocks: Menghasilkan Blok Bersarang Dinamis

Beberapa resource memiliki blok konfigurasi berulang di dalamnya (seperti port `ingress` pada Firewall Security Group). Menulisnya manual 20 kali melanggar prinsip DRY.

Gunakan blok **`dynamic`**:

```hcl
locals {
  service_ports = [
    { port = 80,  protocol = "tcp", desc = "HTTP Public" },
    { port = 443, protocol = "tcp", desc = "HTTPS Public" },
    { port = 22,  protocol = "tcp", desc = "SSH Bastion" }
  ]
}

resource "aws_security_group" "web_sg" {
  name        = "web-security-group"
  description = "Security group otomatis via dynamic block"

  # Iterasi blok bersarang 'ingress' secara dinamis:
  dynamic "ingress" {
    for_each = local.service_ports
    content {
      description = ingress.value.desc
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}
```

---

## 3. `for` Expressions: Transformasi List & Map

Kita bisa mentransformasikan dan menyaring (*filter*) koleksi data langsung di HCL:

```hcl
variable "raw_subnets" {
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24", "192.168.1.0/24"]
}

# 1. Transformasi List ke List Baru (Hanya ambil subnet 10.0.*):
locals {
  private_subnets = [for cidr in var.raw_subnets : cidr if startswith(cidr, "10.0.")]
  # Hasil: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]

# 2. Transformasi List ke Map (Kamus):
  subnet_map = {for idx, cidr in local.private_subnets : "subnet-${idx}" => cidr}
  # Hasil: { "subnet-0" = "10.0.1.0/24", "subnet-1" = "10.0.2.0/24", ... }
}
```

---

## 4. Splat Operator (`[*]`): Mengambil Properti Massal

Alih-alih menulis loop `for`, gunakan Splat Operator `[*]` untuk mengekstrak atribut dari kumpulan resource:

```hcl
resource "aws_instance" "workers" {
  count = 3
  # ...
}

output "all_worker_private_ips" {
  # Mengambil list seluruh private IP dari ke-3 VM sekaligus:
  value = aws_instance.workers[*].private_ip
  # Hasil: ["10.0.1.15", "10.0.1.16", "10.0.1.17"]
}
```
