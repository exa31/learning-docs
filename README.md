# 📚 Personal Dev Docs & Cheatsheets (Astro Starlight)

Web dokumentasi dan buku saku sintaks pribadi harian berbasis **Astro Starlight** (`@astrojs/starlight: ^0.43.1`). Didesain khusus untuk mencari dan mengingat kembali konsep bahasa pemrograman (JavaScript, TypeScript, Kotlin, dan Terraform) secara instan, to-the-point, dan aplikatif.

---

## 🚀 Menjalankan Web Dokumentasi Lokal

```bash
# 1. Jalankan development server:
npm run dev

# Web otomatis aktif di:
# 👉 http://localhost:4321
```

Perintah lain:
- `npm run build`: Kompilasi static site ke `dist/` (lengkap dengan index Pagefind search).
- `npm run preview`: Preview lokal hasil build produksi.

---

## ☸️ Arsitektur Deployment & Infrastruktur (Kubernetes + Cloudflare)

Infrastruktur dan deployment web dokumentasi ini telah didaftarkan ke repository sentral **`/Users/macbookair/templates/kubernetes-config`**:

1. **Docker Container**:
   - `Dockerfile` multi-stage: Node.js 22 (builder) $\to$ Nginx Alpine (~25MB) dengan healthcheck probe `/healthz`.
   - CI/CD GitHub Actions di `.github/workflows/deploy.yml` otomatis build & push image ke `ghcr.io/exa31/learning-docs:latest`.
2. **Setup Namespace & Secret**:
   - Folder `/Users/macbookair/templates/kubernetes-config/learning-docs/` sudah dibuat.
   - Script `setup.sh` telah dijalankan untuk membuat namespace `learning` dan meng-copy `ghcr-secret`.
3. **Terraform Stack & Cloudflare DNS**:
   - Didaftarkan di `/Users/macbookair/templates/kubernetes-config/teraform/main.tf` via module `learning-docs` (`./modules/k8s-app`).
   - Domain: **`docs.eka-dev.cloud`** (otomatis dibuatkan Cloudflare DNS A record proxied, SSL/TLS Let's Encrypt via cert-manager, dan Ingress Traefik).
   - Deployment: 1 replika, health probe `/healthz`, dan `revision_history_limit = 10`.

### Cara Deploy Stack via Terraform Sentral:
```bash
cd /Users/macbookair/templates/kubernetes-config/teraform

# 1. Preview
terraform plan -target=module.learning-docs

# 2. Deploy
terraform apply -target=module.learning-docs
```

---

## 📜 Cara Cek History Rollout di Kubernetes
```bash
# Cek riwayat revisi rilis di cluster Kubernetes:
kubectl rollout history deployment/learning-docs -n learning

# Rollback instan ke versi sebelumnya jika dibutuhkan:
kubectl rollout undo deployment/learning-docs -n learning
```
