import { mongoDB } from '../index.js'

// Model 
import ProductModel from '../models/Product.js'
import RatingModel from '../models/Rating.js'

export const listProduct = (fastify) => async (request, reply) => {
    const { user_token } = request.query
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    console.log(user_token)
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);
    const ratings = mongoDB.models.Rating || mongoDB.model('Rating', RatingModel);
    const productFilter = user_token ? { status: 1 } : {};
    const allProduct = await produk.find(productFilter);
    const enrichedProducts = await Promise.all(
        allProduct.map(async (product) => {
            const productRatings = await ratings.find({ id_product: product.id_produk });
            const averageRating = productRatings.length > 0 
                ? productRatings.reduce((sum, rating) => sum + parseFloat(rating.rating), 0) / productRatings.length
                : 0;
            const roundedRating = Math.round(averageRating);
            return {
                ...product.toObject(),
                rating: roundedRating
            };
        })
    );
    response.status = true
    response.data.list = enrichedProducts
    return response
}

export const fetchProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { productID } = request.query;
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);
    const singleProduct = await produk.find({id_produk: productID})
    response.status = true
    response.data = {
        product: {...singleProduct}
    }
    return response
}

export const addProduct = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { nama_produk, gambar_url, harga, kategori_id, stok, deskripsi } = {...request.body}
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);

    if(nama_produk === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(gambar_url === "") {
        response.message = "Gambar tidak boleh kosong !"
    } else if(harga <= 0) {
        response.message = "Harga tidak boleh kosong !"
    } else if(kategori_id === "") {
        response.message = "Kategori tidak boleh kosong !"
    } else if(stok <= 0) {
        response.message = "Stok tidak boleh kosong !"
    } else if(deskripsi.length < 5) {
        response.message = "Deskripsi harus lebih dari 5 karakter !"
    } else {
        response.status = true
        response.message = "Tambah item sukses !"
        const newProduk = new produk({ 
            ...request.body,
            id_produk: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    const { id_produk, nama_produk, gambar_url, harga, kategori_id, stok, deskripsi, status } = {...request.body}
    const produk = mongoDB.models.Product || mongoDB.model('Product', ProductModel);

    if(id_produk === "") {
        response.message = "ID Produk tidak boleh kosong !"
    } else if(gambar_url === "") {
        response.message = "Gambar tidak boleh kosong !"
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
        const existingProduk = await produk.findOne({
            id_produk: id_produk,
        })
        if (!existingProduk) {
            response.status = false;
            response.message = "Produk tidak ditemukan!";
        } else {
            existingProduk.gambar_url = gambar_url;
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
            const newProdukList = await produk.find({})
            response.status = true;
            response.message = "Delete item sukses !"
            response.data.list = newProdukList;
        }
    }
    return response
}