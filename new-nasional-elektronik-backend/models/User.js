import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
})

export default userSchema