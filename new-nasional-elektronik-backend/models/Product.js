import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id_produk: Number,
    nama_produk: String,
    kategori_id: Number,
    harga: Number,
    stok: Number,
    deskripsi: String,
    tanggal_ditambahkan: Date,
    gambar_url: String,
    status: Number,
})

export default productSchema