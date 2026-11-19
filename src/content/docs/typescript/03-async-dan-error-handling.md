---
title: "03. Async & Error Handling"
---

# 🔷 TypeScript - Modul 03: Async, Type Safety & Error Handling

Cheatsheet kilat penanganan fungsi asynchronous, validasi error aman di blok `catch`, dan perangkap `return await` di TypeScript.

---

## 1. Return Type Fungsi Async: Wajib `Promise<T>`

Di TypeScript, setiap fungsi ber-`async` wajib memiliki tipe balikan `Promise<T>`:

```typescript
// Fungsi async dengan return data:
async function getUserId(email: string): Promise<number> {
  return 101;
}

// Fungsi async tanpa return data:
async function sendNotification(pesan: string): Promise<void> {
  await postApi(pesan);
}
```

---

## 2. Penanganan Error Aman: `catch (err: unknown)`

Pada TypeScript modern (`strict: true`), error yang ditangkap di blok `catch` bertipe **`unknown`** (bukan `any`). Kamu tidak boleh langsung mengakses `err.message` tanpa *type narrowing*:

```typescript
async function fetchSafe() {
  try {
    await fetchSomething();
  } catch (err: unknown) {
    //  Gunakan 'instanceof Error' untuk type narrowing:
    if (err instanceof Error) {
      console.error("Pesan error:", err.message);
    } else {
      console.error("Error tak dikenal:", String(err));
    }
  }
}
```

---

## 3. Generic API Fetcher Universal

Pola paling sering dipakai di proyek nyata: membuat 1 fungsi fetcher yang otomatis me-return tipe data sesuai Generic `<T>`:

```typescript
interface Post {
  id: number;
  title: string;
}

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

// Pemanggilan Type-Safe:
async function main() {
  // post otomatis bertipe Post[]:
  const posts = await apiGet<Post[]>("/api/posts");
  console.log(posts[0].title); // Auto-complete & aman!
}
```

---

## 4. ⚠️ Perangkap Kritis: Wajib `return await` di Dalam `try...catch`

Jika kamu ingin blok `catch` menangani error dari fungsi yang di-return, kamu **WAJIB menulis `return await`**:

```typescript
// ❌ SALAH: Error BOCOR keluar tanpa tertangkap catch lokal!
async function bahaya(): Promise<string> {
  try {
    return requestApi(); // Promise belum selesai, langsung dikembalikan!
  } catch (err) {
    console.error("Gagal tertangkap!");
    return "fallback";
  }
}

//  BENAR: Wajib pakai await di dalam try-catch
async function aman(): Promise<string> {
  try {
    return await requestApi(); // Ditunggu di sini, jika reject langsung masuk catch!
  } catch (err) {
    console.error("Error berhasil ditangkap:", err);
    return "fallback";
  }
}
```
