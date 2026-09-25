# Test Plan Login

## Judul & Deskripsi Modul

Modul ini menguji autentikasi SauceDemo, validasi form login, akun terkunci, dan logout. File test terkait: [tests/login.spec.js](../../tests/login.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Tampilan halaman login.
- Login dengan kredensial valid.
- Login dengan username atau password tidak valid.
- Validasi username dan password kosong.
- Login menggunakan akun terkunci.
- Logout setelah login berhasil.

### Out-of-Scope

- Pendaftaran akun baru.
- Pengujian API autentikasi.
- Pengujian brute force, load, dan security penetration.
- Pengujian akun khusus selain locked-out user.

## Prasyarat (Preconditions)

- Node.js, dependency npm, dan Playwright tersedia.
- SauceDemo dapat diakses.
- Browser Chromium dapat dijalankan.
- Base URL Playwright mengarah ke `https://www.saucedemo.com/`.
- Data uji tersedia: `standard_user`, `locked_out_user`, `secret_sauce`, `wrong_username`, dan `wrong_password`.
- Setiap test dimulai dari halaman login melalui `beforeEach`.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-AUTH-001 | Membuka halaman login | Buka base URL; periksa title; periksa field Username, Password, tombol Login, dan area kredensial. | URL SauceDemo | Semua elemen login terlihat dan title `Swag Labs`. | High |
| TC-AUTH-002 | Login dengan kredensial valid | Isi username dan password; klik Login. | `standard_user` / `secret_sauce` | User diarahkan ke `/inventory.html`. | High |
| TC-AUTH-003 | Login dengan username tidak valid | Isi username salah dan password valid; klik Login. | `wrong_username` / `secret_sauce` | Alert menampilkan pesan username dan password tidak cocok. | High |
| TC-AUTH-004 | Login dengan password tidak valid | Isi username valid dan password salah; klik Login. | `standard_user` / `wrong_password` | Alert menampilkan pesan username dan password tidak cocok. | High |
| TC-AUTH-005 | Login dengan username dan password kosong | Biarkan kedua field kosong; klik Login. | Tidak ada username dan password | Sistem menampilkan validasi field wajib dan tidak mengarahkan user ke inventory. | High |
| TC-AUTH-006 | Login tanpa username | Isi password; klik Login. | Password `wrong_password` | Alert mengandung `Username is required`. | High |
| TC-AUTH-007 | Login tanpa password | Isi username; klik Login. | Username `standard_user` | Alert mengandung `Password is required`. | High |
| TC-AUTH-008 | Login menggunakan user terkunci | Isi kredensial user terkunci; klik Login. | `locked_out_user` / `secret_sauce` | Login ditolak dan alert mengandung `Sorry, this user has been locked out`. | High |
| TC-AUTH-009 | Logout setelah login | Login valid; buka menu; klik Logout. | `standard_user` / `secret_sauce` | User kembali ke halaman login. | High |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** seluruh test case High berstatus passed, pesan validasi sesuai, login valid membuka inventory, dan logout kembali ke login.
- **Fail:** ada assertion gagal, user terkunci dapat masuk, pesan validasi tidak sesuai, atau navigasi login/logout salah.

## Pembersihan Data (Postconditions/Cleanup)

- Logout setelah test yang berhasil login.
- Pastikan test berikutnya dimulai dari halaman login.
- Tidak ada data persisten yang perlu dihapus.
