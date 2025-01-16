import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Model 
import ConfirmAddressModel from '../models/ConfirmAddress.js'
import UserModel from '../models/Register.js'

export const checkConfirmAddress = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: false,
    }
    const { user_token, status_filter } = request.query
    if(user_token === "") {
        response.message = "Token tidak boleh kosong !"
    } else {
        const ConfirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel)
        const decoded = jwt.verify(user_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const confirmation = await ConfirmAddress.findOne({ id_user: decoded.userID, status: status_filter })
        
        if(confirmation) {
            response.data = true 
        }
        response.status = true
    }
    return response
}

export const listConfirmAddress = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const ConfirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel)
    const User = mongoDB.models.User || mongoDB.model('User', UserModel);
    const allConfirmation = await ConfirmAddress.find({})
    const enrichedConfirmation = await Promise.all(
        allConfirmation.map(async (address) => {
            const user = await User.findOne({ _id: address.id_user });
            return {
                ...address.toObject(),
                user: user ? { nama: user.nama, picture_profile: user.picture_profile } : null,
            };
        })
    );
    response.status = true
    response.data.list = enrichedConfirmation
    return response
}

// as USER
export const sendConfirmAddress = (fastify) => async (request, reply) => {
    const { user_token, nama_jalan, kode_zip, kota, provinsi, nomor_hp } = {...request.body}
    const response = { 
        status: false,
        message: "",
        data: {}
    }

    if(user_token === "") {
        response.message = "Token tidak boleh kosong !"
    } else if(nama_jalan === "") {
        response.message = "Nama jalan tidak boleh kosong !"
    } else if(kode_zip === "") {
        response.message = "Kode zip tidak boleh kosong !"
    } else if(kode_zip.length !== 5) {
        response.message = "Kode zip harus 5 digit !"
    } else if(!/^\d{5}$/.test(kode_zip)) {
        response.message = "Kode zip harus berupa angka !"
    } else if(kota === "") {
        response.message = "Kota tidak boleh kosong !"
    } else if(provinsi === "") {
        response.message = "Provinsi tidak boleh kosong !"
    } else if(nomor_hp === "") {
        response.message = "Nomor HP tidak boleh kosong !"
    } else if(!/^\d+$/.test(nomor_hp)) {
        response.message = "Nomor HP harus berupa angka !"
    } else {
        const ConfirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel)
        const decoded = jwt.verify(user_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const newConfirmation = new ConfirmAddress({
            ...request.body,
            id_user: decoded.userID,
            tanggal_ditambahkan: new Date(),
            status: 0,
        })
        await newConfirmation.save()

        response.status = true
        response.message = "Berhasil mengirim konfirmasi alamat pengiriman !"
    }
    return response
}

// as ADMIN
export const confirmAddress = (fastify) => async (request, reply) => {
    const { id_confirm_address, status_code } = {...request.body}
    const response = { 
        status: false,
        message: "",
        data: {}
    }

    if(id_confirm_address === "") {
        response.message = "ID tidak boleh kosong !"
    } else if (!status_code || status_code == "") {
        response.message = "Status tidak boleh kosong !"
    } else {
        const ConfirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel)
        const confirmAddressID = new mongoose.Types.ObjectId(id_confirm_address);
        const existingConfirmAddress = await ConfirmAddress.findOne({ _id:  confirmAddressID})
        if(!existingConfirmAddress) {
            response.message = "ID konfirmasi tidak ditemukan !"
        } else {
            console.log(status_code)
            existingConfirmAddress.status = status_code
            await existingConfirmAddress.save()

            const User = mongoDB.models.User || mongoDB.model('User', UserModel);
            const allConfirmation = await ConfirmAddress.find({})
            const enrichedConfirmation = await Promise.all(
                allConfirmation.map(async (address) => {
                    const user = await User.findOne({ _id: address.id_user });
                    return {
                        ...address.toObject(),
                        user: user ? { nama: user.nama, picture_profile: user.picture_profile } : null,
                    };
                })
            );
            response.status = true
            response.message = "Berhasil mengubah status konfirmasi alamat !"
            response.data.list = enrichedConfirmation
        }
    }
    return response
}

export const deleteConfirmationAddress = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_confirm_address } = {...request.body}
    if(id_confirm_address === "") {
        response.message = "ID Transaksi tidak boleh kosong !"
    } else {
        const ConfirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel)
        const deletedConfirmationAddress = await ConfirmAddress.findOne({
            _id: id_confirm_address,
        })
        if (!deletedConfirmationAddress) {
            response.status = false;
            response.message = "Konfirmasi alamat tidak ditemukan!";
        } else {
            if(deletedConfirmationAddress.status === 0) {
                response.status = false;
                response.message = "Harap accept / reject untuk menghapus !";
            } else {
                await ConfirmAddress.findOneAndDelete({
                    _id: id_confirm_address,
                })
                const User = mongoDB.models.User || mongoDB.model('User', UserModel);
                const allConfirmation = await ConfirmAddress.find({})
                const enrichedConfirmation = await Promise.all(
                    allConfirmation.map(async (address) => {
                        const user = await User.findOne({ _id: address.id_user });
                        return {
                            ...address.toObject(),
                            user: user ? { nama: user.nama, picture_profile: user.picture_profile } : null,
                        };
                    })
                );
                response.status = true
                response.message = "Berhasil menghapus baris data konfirmasi alamat !"
                response.data.list = enrichedConfirmation
            }
        }
    }
    return response
}