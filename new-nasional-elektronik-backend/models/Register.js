import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema({
    role: String,
    nama: String,
    email: String,
    telepon: String,
    // alamat: String,
    password: String,
    tanggal_daftar: Date,
    picture_profile: String,
})

export default registerSchema