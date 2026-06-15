# 📦 FastAPI-Smart-Inventory

Sistem Manajemen Inventaris Gudang sederhana adalah aplikasi modern yang responsif, aman, dan efisien. Proyek ini dibangun dengan **FastAPI** sebagai backend framework, **Supabase (PostgreSQL)** sebagai cloud database, dan sistem keamanan berbasis JWT Token.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Fitur Utama

* 🔒 **Autentikasi Aman:** Sistem Registrasi & Login menggunakan enkripsi password *Bcrypt Hashing* dan *JWT (JSON Web Tokens)*.
* 📦 **Manajemen Inventaris Terintegrasi:** Fitur CRUD (Create, Read, Update, Delete) data barang yang langsung terhubung ke Cloud Database.
* 📊 **Kalkulasi Otomatis (Real-time):** Menghitung total kuantitas stok barang dan total nilai aset gudang secara otomatis (*Cash Balancing*).
* 🔍 **Pencarian Responsif:** Fitur filter nama barang secara langsung di sisi klien (*client-side filtering*).
* 📱 **Antarmuka Modern:** UI interaktif menggunakan Tailwind CSS dan notifikasi elegan dari SweetAlert2.

---

## 🛠️ Tech Stack & Dependensi

* **Backend Framework:** FastAPI (Python)
* **Database & Cloud Storage:** Supabase Client
* **Keamanan/Auth:** PyJWT, Bcrypt
* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS (CDN), SweetAlert2

---

## 📂 Struktur Direktori Proyek

```text
├── src/
│   ├── auth.py       # Logika enkripsi, verifikasi, dan generate JWT Token
│   ├── db.py         # Inisialisasi koneksi client Supabase
├── static/
│   ├── style.css     # File stylesheet kustom tambahan
│   ├── script.js     # Logika frontend, Fetch API (AJAX), dan DOM Manipulation
├── templates/
│   ├── index.html    # Halaman antarmuka utama aplikasi (UI)
├── main.py           # Entry point utama aplikasi dan definisi Endpoint API
├── requirements.txt  # Daftar pustaka / dependensi Python proyek
└── README.md
```

---

## 🚀 Cara Menjalankan Secara Lokal

Ikuti langkah-langkah di bawah ini untuk memasang proyek ini di mesin lokal Anda:

### 1. Kloning Repositori

```bash
git clone https://github.com/username_lu/FastAPI-Smart-Inventory.git
cd FastAPI-Smart-Inventory
```

### 2. Persiapan Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Untuk Linux/Mac
venv\Scripts\activate     # Untuk Windows
```

### 3. Instalasi Dependensi

```bash
pip install -r requirements.txt
```

### 4. Konfigurasi Environment Variables

Buat file bernama `.env` di direktori utama (root) proyek, lalu isi dengan kredensial Anda:

```env
SUPABASE_URL=isi_dengan_url_supabase_anda
SUPABASE_KEY=isi_dengan_anon_key_supabase_anda
JWT_SECRET=isi_dengan_key_rahasia_jwt_anda
```

### 5. Jalankan Aplikasi

```bash
uvicorn main:app --reload
```

Buka browser Anda dan akses halaman di: `http://localhost:8000`

---

## 🤖 Pemanfaatan Teknologi AI

Proyek ini dikembangkan secara mandiri dengan memanfaatkan **Gemini AI** sebagai asisten pemrograman (*AI Coding Assistant*). AI digunakan secara kolaboratif untuk membantu dalam:
* Optimalisasi struktur kode dan refactoring *endpoint* FastAPI.
* Penyusunan arsitektur Fetch API pada sisi frontend JavaScript.
* Debugging dan penanganan dependensi pustaka Python.

