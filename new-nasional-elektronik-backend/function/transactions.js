import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Model 
import ProductsModel from '../models/Product.js'
import DTransModel from '../models/D_trans.js'
import HTransModel from '../models/H_trans.js'
import RegisterModel from '../models/Register.js'

export const listTransaction = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { jwt_token, role } = request.query
    if (jwt_token && jwt_token.length > 0) {
        const HTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
        const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
    
        const allTransaction = await HTrans.find(role === "user" ? { id_pelanggan: decoded.userID } : {});
        const updatedTransactions = await Promise.all(
            allTransaction.map(async (transaction) => {
                const user = await User.findOne({ _id: transaction.id_pelanggan });
                return {
                    ...transaction.toObject(),
                    nama_pelanggan: user ? user.nama : null,
                };
            })
        );
    
        response.status = true;
        response.data.list = updatedTransactions;
        return response;
    }
    return {}
}

export const fetchTransaction = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { transactionID } = request.query;
    const TransID = new mongoose.Types.ObjectId(transactionID);
    const Products = mongoDB.models.Products || mongoDB.model('Products', ProductsModel);
    const DTrans = mongoDB.models.D_trans || mongoDB.model('D_trans', DTransModel);
    const transactionDetails = await DTrans.find({id_h_trans: TransID})
    const detailedTransactions = await Promise.all(transactionDetails.map(async (transaction) => {
        const productDetails = await Products.findOne({ id_produk: transaction.id_produk });
        return {
            ...transaction.toObject(),
            product: productDetails ? productDetails : null,
        };
    }));

    response.status = true
    response.data = {
        details: detailedTransactions
    }
    return response
}

export const deleteTransaction = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_transaksi } = {...request.body}
    const transaksi = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);

    if(id_transaksi === "") {
        response.message = "ID Transaksi tidak boleh kosong !"
    } else {
        const deletedTransaksi = await transaksi.findOneAndDelete({
            _id: id_transaksi,
        })
        if (!deletedTransaksi) {
            response.status = false;
            response.message = "Transaksi tidak ditemukan!";
        } else {
            const HTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
            const allTransaction = await HTrans.find({})

            const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
            const updatedTransactions = await Promise.all(
                allTransaction.map(async (transaction) => {
                    const UserID = new mongoose.Types.ObjectId(transaction.id_pelanggan);
                    const user = await User.findOne({ _id: UserID });
                    return {
                    ...transaction.toObject(),
                    nama_pelanggan: user ? user.nama : null,
                    };
                })
            );

            response.status = true;
            response.message = "Delete transaksi sukses !"
            response.data.list = updatedTransactions;
        }
    }
    return response
}

export const notificationHandler = (fastify) => async (request, reply) => {
    const { order_id, transaction_status, status_code } = request.body
    try {
        new mongoose.Types.ObjectId(order_id)
    } catch {
        return
    }
    
    if(transaction_status === "settlement" && status_code === "200") {
        const HTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
        const filter = { _id: new mongoose.Types.ObjectId(order_id) };
        const update = { status: "Success" };
        const result = await HTrans.updateOne(filter, update);
        if (result.modifiedCount > 0) {
            fastify.info(`Order with ID ${order_id} updated to Success.`);
        } else {
            fastify.error(`No matching order found with ID ${order_id}.`);
        }
    }
}