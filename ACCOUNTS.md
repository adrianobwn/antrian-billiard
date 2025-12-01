# Akun Testing

## Customer Accounts
Semua customer menggunakan password: `password`

| Email | Password | Nama |
|-------|----------|------|
| budi.santoso@email.com | password | Budi Santoso |
| siti.nurhaliza@email.com | password | Siti Nurhaliza |
| ahmad.fauzi@email.com | password | Ahmad Fauzi |
| dewi.kartika@email.com | password | Dewi Kartika |
| rizky.pratama@email.com | password | Rizky Pratama |
| maya.anggraini@email.com | password | Maya Anggraini |
| fajar.nugroho@email.com | password | Fajar Nugroho |
| sarah.permata@email.com | password | Sarah Permata |

## Admin Accounts

| Email | Password | Nama | Role |
|-------|----------|------|------|
| admin@antrianbilliard.com | admin123 | Admin Utama | super_admin |
| manager@antrianbilliard.com | manager123 | Manager Operasional | manager |
| kasir@antrianbilliard.com | kasir123 | Staff Kasir | cashier |
| operator@antrianbilliard.com | operator123 | Operator Lapangan | operator |

**URL Login:**
- Customer: `http://127.0.0.1:8002/customer/login`
- Admin: `http://127.0.0.1:8002/admin/login`

---

## Masalah yang Diperbaiki
1. **Model Customer** tidak memiliki kolom `password` di `$fillable`
2. **Migration** tabel `customers` tidak memiliki kolom `password`
3. **Registrasi** tidak menyimpan password ke database
4. **Seeder** tidak menambahkan password untuk customer
5. Model Customer tidak memiliki method `getAuthPassword()` untuk autentikasi

Semua sudah diperbaiki. Login seharusnya sudah berfungsi normal.
