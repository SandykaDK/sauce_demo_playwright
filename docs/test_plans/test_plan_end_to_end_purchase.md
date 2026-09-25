# Test Plan End-to-End Purchase

## Judul & Deskripsi Modul

Modul ini menguji perjalanan pengguna lengkap dari login sampai pembelian berhasil. File test terkait: [tests/end-to-end-purchase.spec.js](../../tests/end-to-end-purchase.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Login dengan user valid.
- Memilih dan menambahkan produk.
- Membuka cart.
- Mengisi data checkout.
- Memvalidasi overview.
- Menyelesaikan pembelian.

### Out-of-Scope

- Semua skenario login negatif.
- Semua variasi sorting inventory.
- Payment gateway nyata.
- Pengujian setiap validasi field secara terpisah.

## Prasyarat (Preconditions)

- SauceDemo tersedia.
- Browser Chromium dapat dijalankan.
- Cart dimulai dalam keadaan kosong.
- Data uji valid: `standard_user`, `secret_sauce`, `Test`, `User`, `12345`.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-E2E-001 | Menyelesaikan pembelian end-to-end | Login; pilih produk; klik Add to cart; buka cart; klik Checkout; isi data customer; klik Continue; periksa overview; klik Finish. | `standard_user` / `secret_sauce`; `Test` / `User` / `12345` | User berhasil menyelesaikan pembelian dan melihat pesan konfirmasi. | High |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** seluruh alur berjalan tanpa error, produk yang dipilih tetap konsisten, total tampil, dan halaman konfirmasi muncul.
- **Fail:** salah satu transisi gagal, produk hilang, checkout tidak dapat dilanjutkan, atau konfirmasi tidak muncul.

## Pembersihan Data (Postconditions/Cleanup)

- Pastikan order selesai atau batalkan bila test gagal di tengah jalan.
- Logout dari aplikasi.
- Reset app state dan kosongkan cart untuk eksekusi berikutnya.
