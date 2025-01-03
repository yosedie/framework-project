import { mongoDB } from '../index.js'
import mongoose from 'mongoose';

// Model 
import DTransModel from '../models/D_trans.js'
import HTransModel from '../models/H_trans.js'
import RegisterModel from '../models/Register.js'

export const listTransaction = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const HTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
    const allTransaction = await HTrans.find({})

    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
    const updatedTransactions = await Promise.all(
        allTransaction.map(async (transaction) => {
            const UserID = new mongoose.Types.ObjectId(transaction.id_pelanggan); // Use id_pelanggan as UserID
            const user = await User.findOne({ _id: UserID }); // Fetch user data by UserID
            return {
            ...transaction.toObject(), // Convert transaction to a plain object
            nama_pelanggan: user ? user.nama : null, // Append nama_pelanggan
            };
        })
    );

    response.status = true;
    response.data.list = updatedTransactions;
    return response;
}

export const fetchTransaction = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { transactionID } = request.query;
    const HTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
    const singleTransaction = await HTrans.find({_id: transactionID})

    const DTrans = mongoDB.models.H_trans || mongoDB.model('D_trans', DTransModel);
    const transactionDetails = await DTrans.find({id_h_trans: transactionID})

    response.status = true
    response.data = {
        transaction: {
            ...singleTransaction
        },
        details: {
            ...transactionDetails
        }
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
            const newTransactionList = await transaksi.find({})
            response.status = true;
            response.message = "Delete transaksi sukses !"
            response.data.list = newTransactionList;
        }
    }
    return response
}