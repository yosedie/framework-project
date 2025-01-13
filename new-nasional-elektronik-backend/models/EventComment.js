import mongoose from 'mongoose';

const eventCommentSchema = new mongoose.Schema({
    id_user: String,
    id_event: String,
    comment: String,
    tanggal_ditambahkan: Date,
})

export default eventCommentSchema