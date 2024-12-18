import mongoose from 'mongoose';

const hTransSchema = new mongoose.Schema({
    id_pelanggan: String,
    total_harga: Number,
    tanggal: Date,
    status: String,
    metode_pembayaran: String,
    alamat_pengiriman: String,
    nomor_resi: String,
    id_pengiriman: String,
})

export default hTransSchema