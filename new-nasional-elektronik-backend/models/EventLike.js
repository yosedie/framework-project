import mongoose from 'mongoose';

const eventLikeSchema = new mongoose.Schema({
    id_user: String,
    id_event: String,
    tanggal_ditambahkan: Date,
})

export default eventLikeSchema