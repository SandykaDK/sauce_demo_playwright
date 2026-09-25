# Test Plan User Types

## Judul & Deskripsi Modul

Modul ini menguji perilaku user khusus SauceDemo yang disediakan untuk simulasi kondisi berbeda. File test terkait: [tests/user-types.spec.js](../../tests/user-types.spec.js).

## Cakupan Pengujian (Scope)

### In-Scope

- Login dan akses inventory menggunakan user khusus.
- Perilaku UI `problem_user` pada alur inventory dan produk.
- Respons aplikasi saat menggunakan `performance_glitch_user`.
- Penanganan error menggunakan `error_user`.
- Validasi tampilan menggunakan `visual_user`.
- Konsistensi bahwa user khusus yang dapat login tetap mengikuti alur aplikasi yang ditentukan.

### Out-of-Scope

- Pengujian `standard_user` karena tercakup di test plan login dan end-to-end.
- Pengujian `locked_out_user` karena tercakup di test plan login.
- Benchmark performa formal atau load testing.
- Perbandingan pixel visual penuh tanpa baseline screenshot.

## Prasyarat (Preconditions)

- SauceDemo dapat diakses.
- Password semua user khusus adalah `secret_sauce`.
- Browser Chromium dan Playwright tersedia.
- Setiap user diuji dalam browser context/session terpisah.
- Ekspektasi perilaku khusus sudah ditentukan sebelum assertion dibuat.

## Detail Skenario & Test Case

| ID Test | Skenario Pengujian | Langkah Pengujian (Test Steps) | Data Uji | Hasil yang Diharapkan | Prioritas |
|---|---|---|---|---|---|
| TC-USER-001 | Login sebagai problem user | Login; buka inventory; periksa produk, gambar, dan aksi produk. | `problem_user` / `secret_sauce` | User dapat login dan perbedaan perilaku UI tercatat sesuai ekspektasi aplikasi. | Medium |
| TC-USER-002 | Login sebagai performance glitch user | Login; ukur atau amati penyelesaian login dan inventory; lanjutkan aksi utama. | `performance_glitch_user` / `secret_sauce` | Aplikasi tetap menyelesaikan alur dan tidak timeout pada batas test yang disepakati. | Medium |
| TC-USER-003 | Login sebagai error user | Login; jalankan aksi inventory yang ditentukan; periksa alert atau error UI. | `error_user` / `secret_sauce` | Perilaku error yang diharapkan terdeteksi dan tidak menyebabkan test gagal tanpa diagnosis. | Medium |
| TC-USER-004 | Login sebagai visual user | Login; ambil screenshot halaman target; bandingkan dengan baseline visual. | `visual_user` / `secret_sauce` | Tampilan sesuai baseline yang disetujui atau perbedaan visual terdokumentasi. | Low |

## Kriteria Keberhasilan (Pass/Fail Criteria)

- **Pass:** setiap user khusus menghasilkan perilaku yang terdokumentasi dan sesuai ekspektasi yang telah ditetapkan.
- **Fail:** user yang seharusnya dapat login tidak dapat login, aplikasi timeout di luar batas, error tidak terdeteksi, atau perubahan visual tidak terkontrol.
- Test ini tidak boleh mengubah hasil test login umum atau test end-to-end.

## Pembersihan Data (Postconditions/Cleanup)

- Logout dari user yang berhasil login.
- Reset app state dan kosongkan cart.
- Tutup browser context setelah setiap user.
- Simpan screenshot atau trace hanya ketika diperlukan untuk diagnosis.
