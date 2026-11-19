---
title: "08. DOM & Event Handling"
description: Manipulasi elemen HTML, event listener, event delegation, dan trik DOM modern.
---

# 🟡 JavaScript - Modul 08: DOM & Event Handling

Cheatsheet kilat manipulasi elemen HTML dan penanganan event di browser secara modern dan performan.

---

## 1. Seleksi Elemen Modern

Lupakan `document.getElementById` atau `getElementsByClassName` yang kaku, gunakan dua method universal ini:

```javascript
// 1. Ambil SATU elemen pertama yang cocok (CSS selector):
const tombol = document.querySelector("#btn-submit");
const inputEmail = document.querySelector('input[type="email"]');

// 2. Ambil SEMUA elemen yang cocok (me-return NodeList):
const semuaItem = document.querySelectorAll(".menu-item");

// Loop NodeList secara langsung:
semuaItem.forEach((el, index) => {
  el.textContent = `Menu ke-${index + 1}`;
});
```

---

## 2. Manipulasi Konten & Atribut

```javascript
const box = document.querySelector("#card");

// Ubah teks aman (bebas serangan XSS):
box.textContent = "Halo Dunia!";

// Ubah HTML (Hati-hati, hanya jika konten terpercaya):
box.innerHTML = "<strong>Teks Tebal</strong>";

// Manipulasi Class CSS (Gunakan classList):
box.classList.add("aktif", "sorot");
box.classList.remove("sembunyi");
box.classList.toggle("dark-mode"); // Tambah jika belum ada, hapus jika sudah ada
const adaClass = box.classList.contains("aktif"); // true / false

// Dataset (Atribut data-* kustom HTML):
// HTML: <div id="card" data-user-id="123" data-role="admin"></div>
console.log(box.dataset.userId); // "123" (otomatis camelCase)
box.dataset.role = "superadmin"; // Mengubah nilai atribut data-role
```

---

## 3. Event Listener & Pencegahan Default

```javascript
const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  // Wajib untuk form agar halaman tidak reload/refresh:
  e.preventDefault();

  // Menghentikan event bubbling agar tidak tembus ke elemen parent:
  e.stopPropagation();

  console.log("Form dikirim tanpa reload!");
});
```

---

## 4. Pola Sakti: Event Delegation (Hemat Memori)

Daripada memasang `addEventListener` ke 1000 item list satu-per-satu (bikin memori browser jebol), pasang **1 listener saja di elemen pembungkus (parent)**:

```javascript
const daftarList = document.querySelector("#list-produk");

daftarList.addEventListener("click", (e) => {
  // Cek apakah yang diklik adalah tombol hapus atau anaknya:
  const btnHapus = e.target.closest(".btn-delete");

  if (btnHapus) {
    const idItem = btnHapus.dataset.id;
    console.log(`Menghapus produk ID: ${idItem}`);
    btnHapus.closest("li").remove(); // Hapus baris dari DOM
  }
});
```

---

## 5. Membuat & Menyisipkan Elemen Baru

```javascript
// Bikin elemen baru di memori:
const li = document.createElement("li");
li.className = "item-baru";
li.textContent = "Kopi Susu";

// Sisipkan ke dalam container:
const ul = document.querySelector("#daftar-minuman");
ul.appendChild(li); // Masukkan di paling bawah

// Atau gunakan insertAdjacentHTML (sangat cepat untuk template string):
ul.insertAdjacentHTML("beforeend", `<li class="item-baru">Teh Tarik</li>`);
```
