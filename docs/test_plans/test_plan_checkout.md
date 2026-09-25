# Test Plan Checkout

## Judul & Deskripsi Modul

Modul ini menguji proses checkout, validasi data customer, ringkasan pesanan, total, dan konfirmasi pembelian. File test terkait: [tests/checkout.spec.js](../../tests/checkout.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Membuka checkout dari cart.
- Validasi First Name, Last Name, dan Postal Code.
- Validasi item, subtotal, pajak, dan total.
- Menyelesaikan pembelian.
- Membatalkan checkout.

### Out-of-Scope

- Payment gateway nyata.
- Pengujian API, database, dan email konfirmasi.
- Load atau stress testing.
- Pengujian cart yang tidak berkaitan langsung dengan checkout.

## Prasyarat (Preconditions)

- User telah login sebagai `standard_user`.
- Minimal satu produk berada di cart.
- Data valid: `Test`, `User`, `12345`.
- Untuk test validasi, field terkait sengaja dikosongkan.
- Setiap test dimulai dengan cart dan session yang terisolasi.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-CHECK-001 | Membuka checkout | Tambahkan produk; buka cart; klik Checkout. | Satu produk | Halaman informasi checkout terbuka. | High |
| TC-CHECK-002 | Checkout dengan data valid | Isi seluruh field; klik Continue. | `Test` / `User` / `12345` | User diarahkan ke halaman overview. | High |
| TC-CHECK-003 | First Name kosong | Buka checkout; kosongkan First Name; klik Continue. | Last Name dan Postal Code valid | Alert validasi First Name tampil. | High |
| TC-CHECK-004 | Last Name kosong | Buka checkout; isi First Name; kosongkan Last Name; klik Continue. | First Name dan Postal Code valid | Alert validasi Last Name tampil. | High |
| TC-CHECK-005 | Postal Code kosong | Buka checkout; isi nama; kosongkan Postal Code; klik Continue. | First Name dan Last Name valid | Alert validasi Postal Code tampil. | High |
| TC-CHECK-006 | Validasi ringkasan dan total | Lanjutkan ke overview; periksa item, subtotal, pajak, dan total. | Satu produk | Semua nilai tampil dan total sesuai perhitungan aplikasi. | High |
| TC-CHECK-007 | Menyelesaikan pembelian | Dari overview klik Finish. | Data checkout valid | Pesan konfirmasi pembelian tampil. | High |
| TC-CHECK-008 | Membatalkan checkout | Dari cart atau checkout klik Cancel. | Satu produk | User kembali ke halaman yang sesuai tanpa menyelesaikan order. | Medium |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** data valid dapat melewati checkout, data wajib tervalidasi, nilai order benar, dan Finish menampilkan konfirmasi.
- **Fail:** field kosong dapat dilanjutkan, total salah, checkout macet, atau konfirmasi tidak tampil.

## Pembersihan Data (Postconditions/Cleanup)

- Setelah order selesai, pastikan cart kembali kosong sesuai perilaku aplikasi.
- Jika checkout dibatalkan, hapus produk dari cart.
- Logout atau reset app state.
