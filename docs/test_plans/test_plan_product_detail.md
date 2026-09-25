# Test Plan Product Detail

## Judul & Deskripsi Modul

Modul ini menguji halaman detail produk dan perpindahan kembali ke inventory. File test terkait: [tests/product-detail.spec.js](../../tests/product-detail.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Membuka detail produk.
- Validasi nama, deskripsi, harga, dan gambar produk.
- Menambahkan produk dari halaman detail.
- Kembali ke halaman inventory.

### Out-of-Scope

- Sorting produk.
- Validasi cart secara menyeluruh.
- Checkout.
- Pengujian tampilan lintas browser.

## Prasyarat (Preconditions)

- User telah login sebagai `standard_user`.
- Halaman inventory dapat dibuka.
- Produk target tersedia.
- Cart dikosongkan sebelum test yang memeriksa penambahan produk.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-PROD-001 | Validasi informasi detail produk | Buka detail sebuah produk; periksa nama, deskripsi, harga, gambar, dan tombol aksi. | Produk pertama | Semua informasi sesuai dengan produk yang dipilih. | Medium |
| TC-PROD-002 | Menambahkan produk dari detail | Buka detail produk; klik Add to cart; periksa badge cart. | Produk pertama | Produk masuk cart dan jumlah badge bertambah. | High |
| TC-PROD-003 | Kembali dari detail ke inventory | Buka detail; klik Back to products. | Produk pertama | User kembali ke `/inventory.html`. | Medium |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** detail menampilkan data produk yang benar, Add to cart bekerja, dan navigasi kembali menuju inventory.
- **Fail:** data berbeda dari produk asal, tombol tidak bekerja, atau URL tujuan salah.

## Pembersihan Data (Postconditions/Cleanup)

- Hapus produk yang ditambahkan dari cart.
- Logout atau reset app state.
