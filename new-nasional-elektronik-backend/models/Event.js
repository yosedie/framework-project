import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    judul: String,
    deskripsi: String,
    gambar_url: String,
    tanggal_ditambahkan: Date,
})

export default eventSchema