# Handover Dokumen - TaniPlus

## 1. Pendahuluan
Proyek **TaniPlus** adalah aplikasi mobile berbasis **ReactLynx** yang dikembangkan dengan melakukan kloning dari desain Figma. ReactLynx dipilih sebagai teknologi utama karena memiliki keunggulan dalam rendering native mobile dengan performa tinggi (menggunakan engine Lynx yang merender elemen secara native di perangkat Android/iOS) namun tetap mempertahankan kemudahan pengembangan menggunakan pola pemrograman React dan styling berbasis CSS. TaniPlus dirancang untuk membantu petani dalam memantau kondisi pertanian mereka secara real-time melalui integrasi data sensor (seperti kelembapan tanah, suhu, dan nutrisi) yang divisualisasikan dalam bentuk "Box" atau wilayah pemantauan.

---

## 2. Sumber Figma
Aplikasi ini dikloning dan dikembangkan berdasarkan spesifikasi desain visual yang terdapat pada berkas Figma berikut:
*   **File Key**: `vOEqPk9SV1RYRM9zAJXYYJ`
*   **Halaman (Page)**: `Design`
*   **Frame Desain**:
    *   `Login Page`: Halaman masuk pengguna menggunakan nomor telepon dan password dengan opsi "Ingat saya" serta link lupa password.
    *   `Daftar Page`: Halaman registrasi untuk pengguna baru yang memiliki kesamaan komponen UI dengan halaman login.
    *   `Dashboard`: Halaman utama aplikasi setelah masuk, menampilkan ringkasan status wilayah, rekomendasi pintar, statistik box aktif, dan daftar detail box pemantauan.

---

## 3. Struktur Proyek
Seluruh kode sumber frontend terletak di dalam direktori `src/`. Berikut adalah penjelasan kegunaan berkas dan komponen utama:

### Berkas Konfigurasi & Entri Utama
*   `src/App.tsx`: Komponen utama pengatur navigasi antar-halaman (state manager) yang memandu alur perpindahan layar antara `login`, `register`, dan `dashboard`.
*   `src/App.css`: Menyediakan gaya visual global untuk kontainer aplikasi utama (`MainAppContainer`) agar terpusat dan memiliki latar belakang yang konsisten.
*   `src/lynx-types.d.ts`: Deklarasi tipe TypeScript global untuk mendukung tag bawaan engine Lynx seperti `<scroll-view>` dan modifikasi atribut elemen `<input>` agar terhindar dari error tipe TypeScript.

### Komponen Halaman (Screens)
*   `src/components/Login.tsx` & `src/components/Login.css`: Layar login yang mengimplementasikan form nomor telepon, password, checkbox ingat saya, tombol masuk (mengalihkan ke dashboard), dan navigasi ke halaman daftar.
*   `src/components/Register.tsx`: Layar registrasi yang memiliki struktur serupa dengan layar login, memberikan alur bagi pengguna baru untuk mendaftar.
*   `src/components/Dashboard.tsx` & `src/components/Dashboard.css`: Layar utama pasca-login yang memuat widget rekomendasi pintar (menyoroti box bermasalah), ringkasan statistik (wilayah bagus, butuh perawatan, box aktif), tombol logout, dan daftar scrollable berisi box-box pertanian menggunakan data tiruan (mock data).

### Komponen UI Reusable
*   `src/components/TextField.tsx` & `src/components/TextField.css`: Komponen input teks kustom yang mendukung ikon telepon (`phone`) dan kunci (`key`), pembungkusan event input, serta visualisasi gaya input modern.
*   `src/components/Checkbox.tsx` & `src/components/Checkbox.css`: Komponen checkbox kustom yang mengelola status terpilih (checked) dengan animasi ceklis internal tanpa mengandalkan input checkbox bawaan HTML yang berat di platform native.

---

## 4. Target Multi-Platform (Web & Native)
Proyek ini menggunakan bundler **Rspeedy** (berbasis Rsbuild) yang dikonfigurasi untuk secara otomatis menghasilkan kompilasi multi-platform dalam sekali proses build:
1.  **Native Bundle (`dist/main.lynx.bundle`)**: Berkas JavaScript hasil kompilasi yang dioptimalkan untuk dieksekusi langsung oleh engine native Lynx di perangkat mobile.
2.  **Web Bundle (`dist/main.web.bundle`)**: Berkas bundle yang dikompilasi agar dapat dirender di browser web standar untuk keperluan simulasi, debugging, dan pratinjau instan tanpa emulator.

---

## 5. Cara Menjalankan & Debug

### A. Pratinjau Web (Web Preview) di Lokal
Untuk menjalankan server pengembangan lokal:
```bash
npm run dev
```
Setelah server berjalan, Anda dapat membuka pratinjau versi web secara langsung di browser laptop melalui tautan berikut:
`http://localhost:3000/__web_preview?casename=main.web.bundle`

### B. Forwarding Menggunakan Ngrok (Untuk Akses Internet/HP Real)
Jika ingin menguji aplikasi langsung pada perangkat handphone fisik yang tidak berada dalam jaringan Wi-Fi yang sama, Anda dapat menggunakan Ngrok untuk membuat tunnel publik:
1.  Jalankan ngrok pada port 3000:
    ```bash
    ngrok http 3000
    ```
2.  Salin URL HTTPS publik yang dihasilkan oleh ngrok (contoh: `https://abcd-123.ngrok-free.app`).
3.  Buka tautan web preview dengan menambahkan parameter bypass warning ngrok agar aset bundle dapat dimuat tanpa terhalang halaman peringatan:
    `https://abcd-123.ngrok-free.app/__web_preview?casename=main.web.bundle&ngrok-skip-browser-warning=true`

### C. Menjalankan di Handphone / Emulator via Lynx Explorer
1.  Unduh dan pasang aplikasi **Lynx Explorer** di handphone Android/iOS Anda atau jalankan di emulator.
2.  Pastikan server development (`npm run dev`) sedang aktif di komputer Anda.
3.  Scan QR Code yang muncul pada terminal komputer Anda saat menjalankan perintah `npm run dev` menggunakan pemindai di aplikasi Lynx Explorer. Aplikasi TaniPlus versi native akan langsung dimuat secara real-time.

---

## 6. Pipeline Build APK

### A. Struktur Proyek Native Android
Di dalam folder `android/`, terdapat proyek Android native utuh berbasis Kotlin dan Gradle yang siap membungkus bundle ReactLynx:
*   `android/app/src/main/assets/`: Direktori tempat menyimpan berkas `main.lynx.bundle` agar dibaca secara offline oleh aplikasi saat dipasang di handphone.
*   `android/app/src/main/java/com/taniplus/MyApplication.kt` & `MainActivity.kt`: Kode inisialisasi engine Lynx di sisi native Android.

### B. Skrip Build APK Lokal
Tersedia dua skrip otomasi lokal untuk mempermudah developer melakukan kompilasi APK secara mandiri tanpa perlu membuka Android Studio:
*   **Windows Batch Script (`build-apk.bat`)**:
    Menjalankan proses build frontend (`npm run build`), membuat folder assets apabila belum ada, menyalin bundle native ke folder assets Android, dan memanggil Gradle wrapper (`gradlew.bat assembleDebug`) untuk memproduksi berkas `TaniPlus-debug.apk` di root direktori.
*   **PowerShell Script (`build-apk.ps1`)**:
    Skrip PowerShell yang lebih canggih dengan fitur deteksi lokasi Android SDK secara otomatis melalui env `$env:ANDROID_HOME` atau direktori default AppData local, sebelum menjalankan kompilasi Gradle dan menyalin APK final ke root proyek.

### C. CI/CD Pipeline (GitHub Actions)
Terdapat pipeline build otomatis menggunakan GitHub Actions yang didefinisikan di `.github/workflows/build-apk.yml`. Pipeline ini akan terpicu secara otomatis pada setiap kejadian **push** atau **pull request** ke branch **main**, serta dapat dijalankan secara manual (workflow dispatch).

**Tahapan Pipeline GitHub Actions:**
1.  **Checkout Code**: Mengunduh repositori kode TaniPlus.
2.  **Set up Node.js**: Menyiapkan Node.js versi 22 dengan caching npm untuk mempercepat instalasi.
3.  **Install Frontend Dependencies**: Menjalankan `npm install` untuk memuat seluruh library.
4.  **Build ReactLynx Bundle**: Menjalankan `npm run build` untuk memproduksi `main.lynx.bundle`.
5.  **Copy Bundle to Android Assets**: Membuat direktori target dan menyalin berkas bundle ke dalam aset proyek Android.
6.  **Set up JDK 17**: Mengonfigurasi Java Development Kit 17 (Zulu distribution) yang dibutuhkan oleh Gradle.
7.  **Build APK with Gradle**: Menginisialisasi Gradle wrapper versi 8.5, memberikan izin eksekusi (`chmod +x gradlew`), dan memanggil perintah `./gradlew assembleDebug` untuk mengompilasi APK Android debug.
8.  **Upload APK Artifact**: Mengunggah file `app-debug.apk` hasil kompilasi ke server GitHub Artifacts dengan nama `TaniPlus-debug-apk` sehingga dapat diunduh langsung dari tab Actions di repositori GitHub.
