# TaniPlus Project Rules

Dokumen ini merangkum konteks produk dan aturan domain TaniPlus berdasarkan `Garuda Hackathon.md` serta arahan project. Aturan ini menjadi acuan desain dan pengembangan, tetapi tidak otomatis dianggap sudah diimplementasikan.

## Product Scope

- TaniPlus adalah sistem peringatan dini heat stress dan kekeringan untuk pertanian Indonesia selama El Nino.
- Fokus awal adalah tanaman jagung dan keputusan irigasi preventif.
- Pengguna utama: petani, kelompok tani, gapoktan, dan pemerintah daerah.
- Platform menerima data sensor box, menampilkan kondisi lahan, dan menghasilkan rekomendasi air, pupuk, serta waktu tindakan.
- Asumsi awal luas lahan maksimum: `100 x 100 m2`.

## Sensor Box Inputs

Data utama yang digunakan:

- Kandungan atau kebutuhan air
- Kelembapan tanah
- Suhu udara
- Curah hujan
- Umur tanaman dalam HST
- pH tanah
- Status koneksi perangkat
- Status baterai atau sumber daya
- Waktu pembacaan terakhir

Data eksternal yang dapat dipadukan:

- Curah hujan BMKG
- Indeks kekeringan
- Status El Nino

## Box Health Classification

Aturan ini dicatat sebagai aturan domain. Implementasi dan ambang setiap sensor harus divalidasi sebelum dipakai pada sistem produksi.

1. Box dianggap `Bagus` atau hijau jika lebih dari 4 sensor berada dalam kondisi baik. Dengan enam metrik utama, minimal 5 sensor harus sehat.
2. Box dianggap `Perlu Perawatan` atau merah jika kurang dari 4 sensor berada dalam kondisi baik.
3. Nilai tepat 4 belum ditentukan secara eksplisit. Untuk keamanan, jangan mengklasifikasikannya sebelum keputusan produk dibuat.
4. Box dianggap `Error` atau abu-abu jika:
   - Sensor box tidak dapat terhubung ke server.
   - Modul internet mengalami gangguan.
   - Baterai mati atau sumber daya gagal.
   - Data sensor abnormal atau merupakan pencilan, misalnya suhu `100 deg C`.
5. Status `Error` memiliki prioritas tertinggi dan mengalahkan perhitungan jumlah sensor baik.

## Synchronization

- Sensor box melakukan sinkronisasi setiap 10 menit.
- UI harus menampilkan waktu sinkronisasi berdasarkan timestamp data sebenarnya.
- Data yang belum diperbarui setelah interval yang wajar harus ditandai stale atau perlu diperiksa, bukan dianggap realtime.

## Maize Baselines

Baseline awal tanaman jagung:

- Suhu pertumbuhan optimal: `23-30 deg C`.
- Suhu konsisten di atas `35 deg C` dengan kelembapan rendah dapat menyebabkan stres berat.
- Suhu di bawah `10 deg C` memperlambat pertumbuhan dan dapat menyebabkan kerusakan dingin.
- Kelembapan tanah ideal: `70-80%`.
- Setpoint pH awal: `6.0`, dengan rentang optimal bergantung pada fase pertumbuhan.

Rentang pH per fase:

| Fase | HST | Rentang pH |
| --- | ---: | ---: |
| Perkecambahan | 0-10 | 5.5-6.5 |
| Vegetatif | 10-50 | 5.6-6.5 |
| Generatif / berbunga | 50-75 | 6.0-6.8, dapat mencapai 7.0 |
| Pematangan | 75-100+ | 5.6-7.0 |

Kebutuhan air rata-rata jagung:

| Fase | HST | Kebutuhan air |
| --- | ---: | ---: |
| Initial | 0-20 | 23.45 mm |
| Crop development | 21-50 | 90.72 mm |
| Mid-season | 51-90 | 128.55 mm |
| Late season | 91-110 | 13.83 mm |

Total kebutuhan air rata-rata satu periode tanam: `256.55 mm`.

Konversi: `1 mm = 1 liter/m2`.

## Irrigation Recommendations

| Fase | Pemicu | Rekomendasi awal |
| --- | --- | --- |
| Initial | Kelembapan tanah di bawah 70% dan/atau suhu minimal 34 deg C | Siram 6-8 mm. Koreksi pH jika di bawah 6.0. |
| Crop development | Kelembapan tanah di bawah 70% dan/atau tidak ada hujan minimal 3 hari | Siram 12-15 mm. Lakukan pemupukan susulan setelah kelembapan kembali optimal. |
| Mid-season | Kelembapan tanah di bawah 70%, suhu minimal 34 deg C, atau tidak ada hujan minimal 2 hari | Siram 15-20 mm. Prioritaskan irigasi sebelum pemupukan. |
| Late season | Kelembapan tanah di bawah 60-65% atau terjadi kekeringan ekstrem | Siram 5-7 mm. Pemupukan tidak direkomendasikan lagi. |

Contoh rekomendasi pengguna:

- Tambahkan air dalam satuan mm dan estimasi liter berdasarkan luas lahan.
- Sarankan penyiraman pukul `06.00-08.00` untuk mengurangi penguapan.
- Tunda pemupukan nitrogen saat kelembapan tanah rendah.
- Berikan rekomendasi pupuk sesuai fase tanaman dan kondisi tanah.

## User Flow

1. Petani membuat akun.
2. Dashboard awal dapat berada dalam kondisi kosong.
3. Petani memperoleh atau memesan sensor box.
4. Petani memindai QR code unik untuk menghubungkan box dengan akun.
5. Platform menampilkan kondisi setiap box dan lahan.
6. Pengguna membuka detail box untuk melihat metrik serta rekomendasi tindakan.

## Device Concept

Komponen awal sensor box:

- ESP32 sebagai microcontroller
- Sensor suhu dan kelembapan udara weatherproof
- Sensor pH, kelembapan tanah, dan intensitas cahaya
- Capacitive soil moisture sensor
- Solar panel, baterai LiFePO4, dan modul charger
- Box outdoor waterproof IP65

## Business Context

- Model: B2B2C melalui gapoktan.
- Tahun pertama dapat menggunakan subsidi, CSR, atau dukungan pemerintah untuk perangkat dan instalasi.
- Model pendapatan utama berupa subscription untuk maintenance, cloud, dan penggantian sensor.
- Angka subscription masih perlu diselaraskan karena dokumen sumber menyebut periode 4 bulan dan 5 bulan.

## Validation Notes

- Baseline agronomi berasal dari riset atau jurnal yang telah dimodifikasi untuk konsep project dan harus diverifikasi oleh ahli sebelum penggunaan produksi.
- Jangan mengaktifkan pompa atau tindakan fisik otomatis hanya berdasarkan aturan UI tanpa fail-safe perangkat dan validasi lapangan.
- Data eksternal, timestamp, satuan, dan nilai sensor wajib divalidasi pada batas sistem.
- Kondisi batas jumlah tepat 4 sensor sehat harus diputuskan sebelum logic klasifikasi diimplementasikan.
