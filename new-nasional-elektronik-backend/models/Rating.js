import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    id_user: String,
    id_product: String,
    rating: String,
    komentar: String,
})

export default ratingSchema