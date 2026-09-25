# Test Plan Navigation

## Judul & Deskripsi Modul

Modul ini menguji sidebar navigation, perpindahan halaman, reset state, dan logout. File test terkait: [tests/navigation.spec.js](../../tests/navigation.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Membuka dan menutup sidebar.
- Navigasi All Items.
- Navigasi About.
- Reset App State.
- Logout melalui sidebar.

### Out-of-Scope

- Detail fungsional halaman About di luar validasi navigasi.
- Proses login negatif.
- Checkout dan pembayaran.
- Pengujian link eksternal secara mendalam.

## Prasyarat (Preconditions)

- User telah login sebagai `standard_user` untuk menu sidebar.
- Untuk Reset App State, cart berisi minimal satu produk.
- Untuk Logout, session login masih aktif.
- Browser Chromium dan base URL tersedia.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-NAV-001 | Membuka sidebar | Login; klik Open Menu. | `standard_user` | Sidebar dan item menu tampil. | Medium |
| TC-NAV-002 | Navigasi ke All Items | Buka sidebar; klik All Items. | Session valid | User diarahkan ke `/inventory.html`. | Medium |
| TC-NAV-003 | Navigasi ke About | Buka sidebar; klik About. | Session valid | Halaman About Sauce Labs terbuka pada tujuan yang benar. | Low |
| TC-NAV-004 | Reset App State | Tambahkan produk; buka sidebar; klik Reset App State; periksa cart. | Cart berisi produk | State cart kembali kosong atau kondisi awal. | Medium |
| TC-NAV-005 | Logout dari sidebar | Buka sidebar; klik Logout. | Session valid | Session berakhir dan user kembali ke login. | High |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** semua menu dapat dibuka, tujuan navigasi benar, reset menghapus state, dan logout mengakhiri session.
- **Fail:** menu tidak tampil, navigasi salah, state tidak direset, atau halaman terlindungi tetap dapat diakses setelah logout.

## Pembersihan Data (Postconditions/Cleanup)

- Logout setelah setiap test yang membutuhkan session.
- Reset App State dan kosongkan cart.
- Tutup sidebar bila masih terbuka.
