import midtransClient from 'midtrans-client'
import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

// Model 
import DTransModel from '../models/D_trans.js'
import HTransModel from '../models/H_trans.js'

const paymentToken = (fastify) => async (request, reply) => {
    const snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'SB-Mid-server-CKp9TOLZwarw9yQJmntI30yh'
    });

    const parameter = {
        "transaction_details": {
            "order_id": "",
            "gross_amount": 0
        },
        "credit_card": {
            "secure" : true
        },
        "customer_details": {
            "id_pelanggan": "",
            "alamat": "",
        },
        "callbacks": {
            "finish": "http://localhost:3000/sucesstransaction",
        },
    };
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_pelanggan, total_harga, alamat_pengiriman, item } = {...request.body}

    if(id_pelanggan === "") {
        response.message = "ID pelanggan tidak boleh kosong !"
    } else if(total_harga <= 0.0) {
        response.message = "Total harga tidak boleh kosong !"
    } else if(alamat_pengiriman === "") {
        response.message = "Alamat pengiriman tidak boleh kosong !"
    } else if(item === "") {
        response.message = "Item tidak boleh kosong !"
    } else {
        const parsedItem = JSON.parse(item)
        const hTrans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);
        const decoded = jwt.verify(id_pelanggan, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const UserID = new mongoose.Types.ObjectId(decoded.userID);
        const newHtrans = new hTrans({ 
            ...request.body,
            id_pelanggan: UserID,
            tanggal: new Date(),
            status: "Pending",
            metode_pembayaran: "Midtrans",
            nomor_resi: "1234",
            id_pengiriman: "1",
        });
        await newHtrans.save()

        parameter.transaction_details.order_id = newHtrans._id

        const groupedItems = {};
        for (const shoppingItem of parsedItem) {
            const { id_produk, harga } = shoppingItem;
            if (groupedItems[id_produk]) {
                groupedItems[id_produk].jumlah += 1;
                groupedItems[id_produk].harga += harga;
            } else {
                groupedItems[id_produk] = {
                    id_h_trans: newHtrans._id,
                    id_produk,
                    jumlah: 1,
                    harga,
                };
            }
        }

        for (const id_produk in groupedItems) {
            const dTransData = groupedItems[id_produk];
            const dTrans = mongoDB.models.D_trans || mongoDB.model('D_trans', DTransModel);
            const newDTrans = new dTrans({
                id_h_trans: dTransData.id_h_trans,
                id_produk: dTransData.id_produk,
                jumlah: dTransData.jumlah,
                harga: dTransData.harga,
            });
            await newDTrans.save();
        }

        parameter.transaction_details.gross_amount = total_harga
        parameter.customer_details.id_pelanggan = id_pelanggan
        parameter.customer_details.alamat = alamat_pengiriman

        const transaction = await snap.createTransaction(parameter);
        response.status = true
        response.message = "Transaksi terkirim !"
        response.data.token = transaction.token;
        response.data.redirect_url = transaction.redirect_url;
    }
    return response
}

export default paymentToken