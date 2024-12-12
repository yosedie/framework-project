import midtransClient from 'midtrans-client'
import { mongoDB } from '../index.js'

// Model 
import DTransModel from '../models/D_trans.js'
import HTransModel from '../models/H_trans.js'

const payment = (fastify) => async (request, reply) => {
    const parameter = {
        "transaction_details": {
            "order_id": generateRandomPosition(),
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
    const { id_pelanggan, produk, total_harga, alamat_pengiriman } = {...request.body}
    parameter.transaction_details.gross_amount = total_harga
    parameter.customer_details.id_pelanggan = id_pelanggan
    parameter.customer_details.alamat = alamat_pengiriman
    const h_trans = mongoDB.models.H_trans || mongoDB.model('H_trans', HTransModel);

    if(id_pelanggan === "") {
        response.message = "ID pelanggan tidak boleh kosong !"
    } else if(produk === "") {
        response.message = "Produk tidak boleh kosong !"
    } else if(total_harga <= 0.0) {
        response.message = "Total harga tidak boleh kosong !"
    } else if(alamat_pengiriman === "") {
        response.message = "Alamat pengiriman tidak boleh kosong !"
    } else {
        const formattedDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
        response.status = true
        response.message = "Transaksi sukses !"
        const newHTrans = new h_trans({ 
            ...request.body,
            tanggal: formattedDate,
            status: "pending",
            metode_pembayaran: "transfer",
            nomor_resi: "",
            id_pengiriman: "",
        });
        await newHTrans.save();
    }
    return response
}

export default payment