import midtransClient from 'midtrans-client'
import { mongoDB } from '../index.js'

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
            "order_id": `ORDER-${Math.floor(Math.random() * 100000)}`,
            "gross_amount": 0
        },
        "credit_card": {
            "secure" : true
        },
        "customer_details": {
            "id_pelanggan": "",
            "alamat": "",
        }
    };
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_pelanggan, total_harga, alamat_pengiriman } = {...request.body}

    if(id_pelanggan === "") {
        response.message = "ID pelanggan tidak boleh kosong !"
    } else if(total_harga <= 0.0) {
        response.message = "Total harga tidak boleh kosong !"
    } else if(alamat_pengiriman === "") {
        response.message = "Alamat pengiriman tidak boleh kosong !"
    } else {
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