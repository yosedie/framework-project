import mongoose from 'mongoose';

const dTransSchema = new mongoose.Schema({
    id_h_trans: String,
    id_produk: String,
    jumlah: Number,
    harga: Number,
})

export default dTransSchema