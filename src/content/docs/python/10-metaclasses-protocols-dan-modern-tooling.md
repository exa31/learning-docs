---
title: "10. Metaclasses, Protocols & Modern Tooling (uv & ruff)"
description: Metaclass class of classes, static duck typing via typing.Protocol, standardisasi pyproject.toml, dan ekosistem Rust ultra cepat (uv dan ruff) di Python.
---

# 🐍 Python - Modul 10: Metaclasses, Protocols & Modern Tooling (uv & ruff)

Di modul penutup Python ini, kita akan membedah fondasi arsitektur paling dalam dari CPython: **Metaclass**, formalisasi *Duck Typing* melalui **`typing.Protocol`**, serta revolusi tooling modern berbasis Rust yang mengubah ekosistem Python di tahun 2026.

---

## 1. Metaclass: Pabrik Pembuat Class

Jika *Class* adalah cetak biru untuk membuat *Objek*, maka **Metaclass adalah cetak biru untuk membuat Class itu sendiri!**

Secara default, semua class di Python adalah objek instansiasi dari metaclass bawaan bernama **`type`**:

```python
# Membuat class secara dinamis menggunakan 'type' langsung:
# Sintaks: type(nama_class, tuple_parent, dict_atribut)
Robot = type("Robot", (), {"suara": "Beep Boop", "bicara": lambda self: print(self.suara)})

r = Robot()
r.bicara() # Beep Boop!
```

### Membuat Custom Metaclass untuk Validasi Arsitektur:
Metaclass dieksekusi **saat file Python di-import**, sehingga sangat ampuh untuk memvalidasi aturan arsitektur codebase (misal: memaksa semua nama method berawalan `test_` atau memastikan class memiliki atribut wajib):

```python
class StrictModelMeta(type):
    def __new__(mcs, name, bases, namespace):
        # Lewati validasi untuk base class itu sendiri
        if name != "BaseModel":
            if "table_name" not in namespace:
                raise TypeError(f"Class '{name}' WAJIB mendefinisikan atribut 'table_name'!")
        return super().__new__(mcs, name, bases, namespace)

class BaseModel(metaclass=StrictModelMeta):
    pass

class User(BaseModel):
    table_name = "users" # Valid!

# class Produk(BaseModel):
#     pass
# TypeError: Class 'Produk' WAJIB mendefinisikan atribut 'table_name'!
```

---

## 2. Structural Subtyping: `typing.Protocol` (Duck Typing Terstruktur)

Python terkenal dengan filosofi **Duck Typing**: *"Jika berjalan seperti bebek dan bersuara seperti bebek, maka itu adalah bebek"*.

Sebelumnya, duck typing tidak bisa diverifikasi oleh static type checker. Dengan **`typing.Protocol` (PEP 544)**, kita bisa mendefinisikan antarmuka struktural persis seperti Interface di TypeScript atau Go tanpa mewajibkan class melakukan pewarisan eksplisit (*no explicit inheritance*):

```python
from typing import Protocol, runtime_checkable

# Definisikan kontrak perilaku (Interface):
@runtime_checkable # Mengizinkan isinstance() saat runtime!
class Closeable(Protocol):
    def close(self) -> None:
        ...

# Class ini TIDAK MEWARISI Closeable sama sekali:
class FileDatabase:
    def close(self) -> None:
        print("Koneksi file ditutup dengan aman")

class RedisSocket:
    def close(self) -> None:
        print("Soket redis diputus")

def shutdown_service(resource: Closeable):
    resource.close() # Aman & lolos Mypy / Pyright static analysis!

db = FileDatabase()
shutdown_service(db) # VALID!
print(isinstance(db, Closeable)) # True! (Berkat @runtime_checkable)
```

---

## 3. Standardisasi Modern: `pyproject.toml` (PEP 621)

Tinggalkan `setup.py`, `setup.cfg`, dan `requirements.txt` yang terfragmentasi. Standar modern Python menyatukan seluruh konfigurasi dependensi, linter, dan metadata ke dalam **`pyproject.toml`**:

```toml
[project]
name = "learning-api"
version = "1.0.0"
description = "Personal learning portal backend"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "pydantic>=2.7.0",
    "httpx>=0.27.0",
    "fastapi>=0.111.0",
    "uvicorn[standard]>=0.30.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "mypy>=1.10.0",
    "ruff>=0.4.0",
]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.mypy]
strict = true
```

---

## 4. Revolusi Tooling Rust di Dunia Python: `uv` & `ruff`

Astral (perusahaan pembuat tooling Python modern) menulis ulang seluruh infrastruktur Python menggunakan **Rust**, menghasilkan lompatan kecepatan yang luar biasa:

### A. `uv`: Package Manager Ultra Cepat (Pengganti `pip` & `venv`)
- Ditulis 100% dalam Rust.
- **$10\times - 100\times$ lebih cepat** dibanding `pip` standar.
- Mengelola instalasi Python version, virtualenv, dan resolving lockfile (`uv.lock`) secara instan.

```bash
# Instalasi uv:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Membuat virtual environment dalam 10 milidetik:
uv venv

# Menginstal dependensi dalam hitungan detik:
uv pip install -r pyproject.toml
```

### B. `ruff`: Linter & Formatter Pengganti Flake8, Black, dan isort
- Menggantikan 5+ tool Python lama menjadi 1 binary tunggal yang super cepat.
- Mampu memindai jutaan baris kode Python dalam **waktu kurang dari 1 detik**!

```bash
# Memeriksa dan memperbaiki linting otomatis:
ruff check --fix

# Memformat kode otomatis persis seperti Black:
ruff format
```
