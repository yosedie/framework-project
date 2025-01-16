import mongoose from 'mongoose';

const confirmAddressSchema = new mongoose.Schema({
    id_user: String,
    nama_jalan: String,
    kode_zip: String,
    kota: String,
    provinsi: String,
    nomor_hp: String,
    status: Number, // 0 : pending, 1 : diterima, 2 : ditolak
    tanggal_ditambahkan: Date,
})

export default confirmAddressSchema