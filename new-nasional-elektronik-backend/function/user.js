import { mongoDB } from '../index.js'
import mongoose from 'mongoose';

// Model 
import RegisterModel from '../models/Register.js'

export const listUser = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
    const allUser = await User.find({})
    response.status = true
    response.data.list = [
        ...allUser
    ]
    return response
}

export const editUser = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_user, role, nama, email, telepon, password } = {...request.body}
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);

    if(id_user === "") {
        response.message = "ID User tidak boleh kosong !"
    } else if(role === "") {
        response.message = "Role tidak boleh kosong !"
    } else if(nama === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(email === "") {
        response.message = "Email tidak boleh kosong !"
    } else if(telepon === "") {
        response.message = "Telepon tidak boleh kosong !"
    } else {
        const UserID = new mongoose.Types.ObjectId(id_user);
        const existingUser = await User.findOne({
            _id: UserID
        })
        if (!existingUser) {
            response.status = false;
            response.message = "User tidak ditemukan!";
        } else {
            existingUser.role = role;
            existingUser.nama = nama;
            existingUser.email = email;
            existingUser.telepon = telepon;

            if(password !== "") {
                existingUser.password = password;
            }

            await existingUser.save();

            const allUser = await User.find({})
            response.status = true
            response.message = "Edit user sukses !"
            response.data.list = [
                ...allUser
            ]
        }
    }
    return response
}

export const deleteUser = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_user } = {...request.body}
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);

    if(id_user === "") {
        response.message = "ID User tidak boleh kosong !"
    } else {
        const deletedUser = await User.findOneAndDelete({
            _id: id_user,
        })
        if (!deletedUser) {
            response.status = false;
            response.message = "User tidak ditemukan!";
        } else {
            const allUser = await User.find({})
            response.status = true
            response.message = "Delete user sukses !"
            response.data.list = [
                ...allUser
            ]
        }
    }
    return response
}