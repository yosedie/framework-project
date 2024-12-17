import { mongoDB } from '../index.js'

// Model 
import ProductModel from '../models/Product.js'

export const listProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);
    const allProduct = await produk.find({})
    response.status = true
    response.data.list = [
        ...allProduct
    ]
    return response
}

export const addProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { nama_produk, harga, kategori_id, stok, deskripsi } = {...request.body}
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);

    if(nama_produk === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(harga <= 0) {
        response.message = "Harga tidak boleh kosong !"
    } else if(kategori_id === "") {
        response.message = "Kategori tidak boleh kosong !"
    } else if(stok <= 0) {
        response.message = "Stok tidak boleh kosong !"
    } else if(deskripsi.length < 5) {
        response.message = "Deskripsi harus lebih dari 5 karakter !"
    } else {
        const countAllProduct = await produk.find({})
        response.status = true
        response.message = "Tambah item sukses !"
        const newProduk = new produk({ 
            ...request.body,
            id_produk: countAllProduct.length + 1,
            tanggal_ditambahkan: new Date(),
            status: 1,
        });
        await newProduk.save();
    }
    return response
}

export const editProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_produk, nama_produk, harga, kategori_id, stok, deskripsi, status } = {...request.body}
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);

    if(id_produk === "") {
        response.message = "ID Produk tidak boleh kosong !"
    } else if(nama_produk === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(harga <= 0) {
        response.message = "Harga tidak boleh kosong !"
    } else if(kategori_id === "") {
        response.message = "Kategori tidak boleh kosong !"
    } else if(stok <= 0) {
        response.message = "Stok tidak boleh kosong !"
    } else if(deskripsi.length < 5) {
        response.message = "Deskripsi harus lebih dari 5 karakter !"
    } else {
        const existingProduk = await produk.find({
            id_produk: id_produk,
        })
        if (!existingProduk) {
            response.status = false;
            response.message = "Produk tidak ditemukan!";
        } else {
            existingProduk.nama_produk = nama_produk;
            existingProduk.harga = harga;
            existingProduk.kategori_id = kategori_id;
            existingProduk.stok = stok;
            existingProduk.deskripsi = deskripsi;
            existingProduk.status = status;
            response.status = true
            response.message = "Edit item sukses !"
            response.data = existingProduk;
            await existingProduk.save();
        }
    }
    return response
}

export const deleteProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_produk } = {...request.body}
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);

    if(id_produk === "") {
        response.message = "ID Produk tidak boleh kosong !"
    } else {
        const deletedProduk = await produk.findOneAndDelete({
            id_produk: id_produk,
        })
        if (!deletedProduk) {
            response.status = false;
            response.message = "Produk tidak ditemukan!";
        } else {
            response.status = true;
            response.message = "Delete item sukses !"
            response.data = deletedProduk;
        }
    }
    return response
}