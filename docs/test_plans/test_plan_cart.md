# Test Plan Cart

## Judul & Deskripsi Modul

Modul ini menguji pengelolaan produk di cart sebelum checkout. File test terkait: [tests/cart.spec.js](../../tests/cart.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Membuka cart.
- Menampilkan produk yang dipilih.
- Validasi badge jumlah item.
- Menghapus produk.
- Kembali berbelanja.
- Validasi nama dan harga produk di cart.

### Out-of-Scope

- Validasi field checkout.
- Penyelesaian pembayaran.
- Pengujian API dan database.
- Pengujian kuantitas produk selain perilaku yang disediakan UI.

## Prasyarat (Preconditions)

- User login sebagai `standard_user`.
- Minimal satu produk dapat ditambahkan dari inventory.
- Produk target dan harga awal diketahui.
- Setiap test mengisolasi state cart.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-CART-001 | Membuka cart setelah menambahkan produk | Tambahkan produk; klik ikon cart. | Produk pertama | Halaman cart terbuka dan produk tampil. | High |
| TC-CART-002 | Memastikan badge cart sesuai | Tambahkan satu atau lebih produk; periksa badge. | Produk pertama dan kedua | Badge menampilkan jumlah item yang ditambahkan. | High |
| TC-CART-003 | Menghapus produk dari cart | Tambahkan produk; buka cart; klik Remove. | Produk pertama | Produk hilang dan badge berkurang atau tidak tampil saat kosong. | High |
| TC-CART-004 | Melanjutkan belanja | Buka cart; klik Continue Shopping. | Cart dengan satu produk | User kembali ke inventory. | Medium |
| TC-CART-005 | Memvalidasi nama dan harga | Tambahkan produk; buka cart; bandingkan data dengan inventory. | Produk pertama | Nama dan harga di cart sama dengan produk asal. | High |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** cart menampilkan item yang tepat, badge akurat, remove bekerja, data produk konsisten, dan Continue Shopping kembali ke inventory.
- **Fail:** item salah atau hilang, badge tidak sesuai, remove gagal, atau harga/nama berubah.

## Pembersihan Data (Postconditions/Cleanup)

- Hapus semua produk dari cart.
- Jalankan Reset App State jika tersedia.
- Logout setelah test selesai.
