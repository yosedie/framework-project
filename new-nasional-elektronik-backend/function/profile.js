import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

// Model 
import RegisterModel from '../models/Register.js'

export const uploadImage = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { image_url, jwt_token } = {...request.body}
    if(image_url === "") {
        response.message = "Image profile tidak boleh kosong !"
    } else if(jwt_token === "") {
        response.message = "JWT Token tidak boleh kosong !"
    } else {
        // const formattedDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
        response.status = true
        response.message = "Upload image sukses !"
        const userModel = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const UserID = new mongoose.Types.ObjectId(decoded.userID);
        const existingUser = await userModel.findOne({ _id: UserID})
        if (!existingUser) {
            response.status = false;
            response.message = "User tidak ditemukan!";
        } else {
            response.status = true;
            response.message = "Upload profile sukses!";
            response.data.picture_profile = image_url;
            existingUser.picture_profile = image_url;
            await existingUser.save();
        }
    }
    return response
}

export const changeSecurity = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { jwt_token, nama, email, telepon, password } = {...request.body}
    if(jwt_token === "") {
        response.message = "ID User tidak boleh kosong !"
    } else if(nama === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(email === "") {
        response.message = "Email tidak boleh kosong !"
    } else if(telepon === "") {
        response.message = "Telepon tidak boleh kosong !"
    } else {
        const userModel = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const UserID = new mongoose.Types.ObjectId(decoded.userID);
        const existingUser = await userModel.findOne({ _id: UserID})
        if (!existingUser) {
            response.status = false;
            response.message = "User tidak ditemukan!";
        } else {
            existingUser.nama = nama;
            existingUser.email = email;
            existingUser.telepon = telepon;

            if(password && password.length > 0) {
                existingUser.password = password;
            }

            await existingUser.save();
            response.status = true
            response.message = "Ganti profile sukses !"
        }
    }
    return response
}