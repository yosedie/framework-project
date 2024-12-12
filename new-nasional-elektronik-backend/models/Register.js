import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    nama: String,
    email: String,
    telepon: String,
    // alamat: String,
    password: String,
    tanggal_daftar: String,
})

export default registerSchema