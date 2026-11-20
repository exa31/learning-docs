---
title: "09. Type-Safe API Client & Result Pattern Error Handling"
description: Membangun generic fetch wrapper type-safe, kontrak ApiResponse discriminated union, Result type ala Rust, dan safe unknown error handling di TypeScript.
---

# 🔷 TypeScript - Modul 09: Type-Safe API Client & Result Pattern Error Handling

Dalam arsitektur frontend atau Node.js modern, pemanggilan REST API harus dibungkus dengan lapisan klien yang menjamin konsistensi tipe dan menyederhanakan penanganan error tanpa sarang `try-catch` yang berantakan.

---

## 1. Menangani Error di Blok `catch (err)` Secara Type-Safe

Sejak TypeScript 4.4 dengan flag `useUnknownInCatchVariables: true`, variabel di dalam blok `catch (err)` otomatis bertipe **`unknown`**, bukan `any`:

```typescript
try {
    throw new Error("Koneksi database timeout");
} catch (err: unknown) {
    // err.message; // COMPILE ERROR: 'err' is of type 'unknown'

    // Wajib narrowing sebelum mengakses properti error:
    if (err instanceof Error) {
        console.error("Pesan error valid:", err.message);
    } else {
        console.error("Objek dilempar bukan Error standar:", String(err));
    }
}
```

---

## 2. Pola Penanganan Error Bebas Try-Catch: `Result<T, E>` (Ala Rust)

Alih-alih melempar exception liar, kita bisa mengadopsi pola `Result` yang deterministik:

```typescript
// Tipe Result sebagai Discriminated Union
export type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

// Helper pembungkus Promise aman:
export async function toResult<T>(promise: Promise<T>): Promise<Result<T, Error>> {
    try {
        const value = await promise;
        return { ok: true, value };
    } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { ok: false, error };
    }
}

// Cara Penggunaan Bersih:
async function main() {
    const res = await toResult(fetchDataDariServer());
    
    if (!res.ok) {
        // res.error otomatis tersedia!
        console.error("Gagal mengambil data:", res.error.message);
        return;
    }

    // res.value DIJAMIN ADA!
    console.log("Data sukses:", res.value);
}
```

---

## 3. Membangun Type-Safe Generic API Client

Berikut arsitektur klien API produksi yang membungkus native `fetch` dengan parameter generic, batas waktu (*timeout*), dan standardisasi response:

```typescript
interface RequestOptions<TBody> extends RequestInit {
    bodyData?: TBody;
    timeoutMs?: number;
}

export type ApiResponse<T> =
    | { success: true; data: T; status: number }
    | { success: false; error: { code: string; message: string }; status: number };

export class ApiClient {
    constructor(private baseUrl: string) {}

    public async request<TResponse, TBody = unknown>(
        endpoint: string,
        options: RequestOptions<TBody> = {}
    ): Promise<ApiResponse<TResponse>> {
        const { bodyData, timeoutMs = 8000, ...customConfig } = options;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const headers = new Headers(customConfig.headers);
        if (bodyData) {
            headers.set("Content-Type", "application/json");
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...customConfig,
                headers,
                signal: controller.signal,
                body: bodyData ? JSON.stringify(bodyData) : undefined,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: {
                        code: errorData.code || "HTTP_ERROR",
                        message: errorData.message || `Request gagal dengan status ${response.status}`,
                    },
                    status: response.status,
                };
            }

            const data: TResponse = await response.json();
            return {
                success: true,
                data,
                status: response.status,
            };
        } catch (err: unknown) {
            clearTimeout(timeoutId);
            const isAbort = err instanceof DOMException && err.name === "AbortError";
            return {
                success: false,
                error: {
                    code: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
                    message: isAbort ? "Request melebihi batas waktu (timeout)" : "Gagal terhubung ke jaringan",
                },
                status: 0,
            };
        }
    }
}
```

### Menggunakan Klien API Secara Type-Safe:
```typescript
interface UserDTO {
    id: number;
    nama: string;
}

interface CreateUserPayload {
    nama: string;
    email: string;
}

const api = new ApiClient("https://api.eka-dev.cloud");

// Type-checking penuh pada payload kirim DAN format response terima:
const res = await api.request<UserDTO, CreateUserPayload>("/v1/users", {
    method: "POST",
    bodyData: { nama: "Eka", email: "eka@dev.cloud" },
});

if (res.success) {
    console.log("User baru dibuat:", res.data.id, res.data.nama);
} else {
    console.error(`Gagal [${res.error.code}]: ${res.error.message}`);
}
```
