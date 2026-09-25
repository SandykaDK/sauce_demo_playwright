# Test Plan Inventory

## Judul & Deskripsi Modul

Modul ini menguji halaman inventory, daftar produk, detail singkat, sorting, dan penambahan produk ke cart. File test terkait: [tests/inventory.spec.js](../../tests/inventory.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Tampilan daftar produk.
- Nama, harga, gambar, dan tombol aksi produk.
- Sorting nama ascending/descending.
- Sorting harga ascending/descending.
- Menambahkan produk dari halaman inventory.
- Membuka detail produk dari inventory.

### Out-of-Scope

- Validasi isi cart secara detail.
- Proses checkout dan pembayaran.
- Pengujian API atau database.
- Pengujian user khusus.

## Prasyarat (Preconditions)

- SauceDemo dapat diakses melalui Playwright.
- User sudah login menggunakan `standard_user` / `secret_sauce`.
- Halaman awal berada di `/inventory.html`.
- Cart berada pada kondisi kosong untuk test penambahan produk.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-INV-001 | Menampilkan daftar produk | Login; buka inventory; hitung product card; periksa nama, harga, gambar, dan tombol aksi. | `standard_user` | Daftar produk tampil lengkap dan setiap card memiliki informasi yang diperlukan. | High |
| TC-INV-002 | Membuka detail produk | Klik nama atau link produk dari inventory. | Produk pertama | Halaman detail produk terbuka dengan produk yang benar. | Medium |
| TC-INV-003 | Sort berdasarkan nama | Pilih `Name (A to Z)`; simpan urutan; pilih `Name (Z to A)`; bandingkan urutan. | Nama seluruh produk | Urutan nama sesuai pilihan sorting. | Medium |
| TC-INV-004 | Sort berdasarkan harga | Pilih harga rendah ke tinggi; lalu tinggi ke rendah; bandingkan harga. | Harga seluruh produk | Urutan harga sesuai pilihan sorting. | Medium |
| TC-INV-005 | Menambahkan produk dari inventory | Klik Add to cart pada satu produk; periksa badge cart. | Produk pertama | Produk berhasil ditambahkan dan badge cart bertambah menjadi `1`. | High |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** seluruh informasi produk tampil, sorting menghasilkan urutan benar, dan produk dapat ditambahkan ke cart.
- **Fail:** product card hilang, data produk tidak konsisten, sorting salah, atau tombol Add to cart tidak mengubah cart.

## Pembersihan Data (Postconditions/Cleanup)

- Hapus produk dari cart atau gunakan Reset App State.
- Logout setelah test selesai.
- Kembalikan sorting ke kondisi default bila diperlukan.
