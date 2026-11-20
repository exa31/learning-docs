---
title: "05. Type Hints, @dataclass & Pydantic V2 Validation"
description: Type Hints modern (PEP 604 union |), @dataclass dengan slots=True hemat memori, dan validasi data performa tinggi Pydantic V2 di Python.
---

# 🐍 Python - Modul 05: Type Hints, @dataclass & Pydantic V2 Validation

Ekosistem Python modern telah bertransformasi total: dari kode dinamis tanpa tipe menjadi **type-hinted code** yang terstruktur, aman, dan divalidasi oleh tooling modern seperti **Mypy**, **Pyright**, dan **Pydantic V2**.

---

## 1. Type Hints Modern (Python 3.10+ PEP 604 & PEP 585)

Tinggalkan cara lama yang mengimpor `from typing import List, Dict, Union, Optional`. Di Python modern, gunakan tipe bawaan langsung:

```python
# CARA LAMA (Python 3.8 ke bawah):
# from typing import Union, Optional, List, Dict
# def cari(id: Union[int, str]) -> Optional[List[str]]: ...

# CARA MODERN (Python 3.10+):
def cari_pengguna(
    user_id: int | str,             # Union operator pipa '|'
    limit: int = 10,
    tags: list[str] | None = None   # list bawaan & Optional via '| None'
) -> list[dict[str, any]]:
    return [{"id": user_id, "status": "active"}]

# Literal Types (Hanya menerima pilihan nilai string tertentu):
from typing import Literal
type Tema = Literal["light", "dark", "system"]
```

---

## 2. `@dataclass`: Penghasil Boilerplate Otomatis Bawaan

Decorator bawaan `@dataclass` otomatis menghasilkan method `__init__`, `__repr__`, `__eq__`, dan method perbandingan tanpa perlu ditulis manual:

```python
from dataclasses import dataclass, field
import uuid

@dataclass
class Produk:
    nama: string
    harga: float
    # ATURAN EMAS: Mutable default WAJIB menggunakan default_factory!
    tags: list[str] = field(default_factory=list)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

p = Produk(nama="Keyboard Mechanical", harga=750000)
print(p) # Otomatis dicetak rapi: Produk(nama='Keyboard Mechanical', harga=750000, ...)
```

### ⚡ Trik Sakti: `slots=True` (Hemat RAM 50%!)
Secara default, setiap instance objek Python menyimpan atributnya di dalam dictionary dinamis `__dict__`. Pada Python 3.10+, tambahkan `slots=True` untuk menghapus `__dict__` dan mengunci atribut ke array statis:

```python
@dataclass(slots=True, frozen=True)
class SensorData:
    timestamp: int
    temperature: float
    humidity: float
```
> [!TIP]
> Menggunakan `slots=True` **memangkas penggunaan RAM hingga 50%** dan mempercepat akses atribut sebesar 20%. Tambahkan `frozen=True` untuk menjadikannya *immutable* dan bisa dijadikan key pada dictionary (*hashable*).

---

## 3. Pydantic V2: Standar Emas Validasi Backend & FastAPI

Jika `@dataclass` hanya mendokumentasikan tipe data saat pengetikan kode (*compile-time hint*), **Pydantic V2 memvalidasi dan meng-coerce tipe data secara nyata saat runtime**.

Pydantic V2 ditulis ulang sepenuhnya menggunakan **Rust (`pydantic-core`)**, sehingga **$5\times - 20\times$ lebih cepat** dibanding Pydantic V1!

### Menginstal Pydantic:
```bash
pip install pydantic
```

---

## 4. Mendefinisikan Model Pydantic V2 & Validator

```python
from pydantic import BaseModel, Field, EmailStr, field_validator
from datetime import datetime

class UserRegisterRequest(BaseModel):
    # Validasi otomatis via Field:
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    umur: int = Field(ge=18, le=100, description="Pengguna wajib minimal 18 tahun")
    saldo_awal: float = Field(default=0.0, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Custom Field Validator:
    @field_validator("username")
    @classmethod
    def username_dilarang_admin(cls, val: str) -> str:
        if val.lower() == "admin":
            raise ValueError("Username 'admin' tidak diperbolehkan demi keamanan!")
        return val.lower()

# Pengujian dengan data JSON mentah:
raw_input = {
    "username": "Eka_Dev",
    "email": "eka@dev.cloud",
    "umur": "25", # Pydantic otomatis meng-coerce string "25" menjadi integer 25!
    "saldo_awal": 150000
}

# Parsing & Validasi:
try:
    user = UserRegisterRequest.model_validate(raw_input)
    print("User tervalidasi:", user.username, "Umur:", user.umur)

    # Serialisasi ke Dict atau JSON:
    user_dict = user.model_dump()
    user_json = user.model_dump_json(indent=2)
except Exception as e:
    print("Validasi gagal:", e)
```
