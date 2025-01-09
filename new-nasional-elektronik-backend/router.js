import helloWorld from "./function/helloWorld.js";
import register from "./function/register.js";
import login from "./function/login.js";
import payment from "./function/payment.js";
import paymentToken from "./function/payment_token.js";
import verifyToken from "./function/verify_jwt.js";

import { fetchProduct, listProduct, addProduct, editProduct, deleteProduct } from "./function/products.js";

import { fetchTransaction, listTransaction, deleteTransaction, notificationHandler } from "./function/transactions.js";

import { listUser, editUser, deleteUser } from "./function/user.js";

import { uploadImage, changeSecurity } from "./function/profile.js"

import { listComment, postComment } from "./function/rating.js"

async function routes (fastify, options) {
    const errorWrapper = (fn) => (request, reply) => {
        return fn(request, reply).catch(err => {
            fastify.error(err.message);
            reply.status(500).send(
                { 
                    status: false,
                    message: "Error ! Mohon hubungi admin !",
                    data: {}
                }
            ); 
        });
    };
    
    fastify.get('/', errorWrapper(helloWorld(fastify)))
    fastify.post('/api/register', errorWrapper(register(fastify)))
    fastify.post('/api/login', errorWrapper(login(fastify)))
    fastify.post('/api/payment', errorWrapper(payment(fastify)))
    fastify.post('/api/getPaymentToken', errorWrapper(paymentToken(fastify)))
    fastify.post('/api/verifyToken', errorWrapper(verifyToken(fastify)))

    // Khusus Produk
    fastify.get('/api/fetchProduct', errorWrapper(fetchProduct(fastify)))
    fastify.get('/api/listProduct', errorWrapper(listProduct(fastify)))
    fastify.post('/api/addProduct', errorWrapper(addProduct(fastify)))
    fastify.put('/api/editProduct', errorWrapper(editProduct(fastify)))
    fastify.delete('/api/deleteProduct', errorWrapper(deleteProduct(fastify)))

    // Khusus transaksi
    fastify.post('/api/notificationHandler', errorWrapper(notificationHandler(fastify)))
    fastify.get('/api/fetchTransaction', errorWrapper(fetchTransaction(fastify)))
    fastify.get('/api/listTransaction', errorWrapper(listTransaction(fastify)))
    fastify.delete('/api/deleteTransaction', errorWrapper(deleteTransaction(fastify)))

    // khusus user
    fastify.get('/api/listUser', errorWrapper(listUser(fastify)))
    fastify.put('/api/editUser', errorWrapper(editUser(fastify)))
    fastify.delete('/api/deleteUser', errorWrapper(deleteUser(fastify)))

    // Khusus profile
    fastify.put('/api/uploadImage', errorWrapper(uploadImage(fastify)))
    fastify.put('/api/changeSecurity', errorWrapper(changeSecurity(fastify)))

    // Khusus komentar
    fastify.get('/api/fetchComment', errorWrapper(listComment(fastify)))
    fastify.post('/api/postComment', errorWrapper(postComment(fastify)))
}

export default routes;