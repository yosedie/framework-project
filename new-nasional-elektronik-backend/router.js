import helloWorld from "./function/helloWorld.js";
import register from "./function/register.js";
import login from "./function/login.js";
import payment from "./function/payment.js";
import paymentToken from "./function/payment_token.js";
import verifyToken from "./function/verify_jwt.js";
import axios from "axios"

import { fetchProduct, listProduct, addProduct, editProduct, deleteProduct } from "./function/products.js";

import { countUserTransaction, fetchTransaction, listTransaction, deleteTransaction, notificationHandler } from "./function/transactions.js";

import { listUser, editUser, deleteUser } from "./function/user.js";

import { uploadImage, changeSecurity } from "./function/profile.js"

import { listComment, postComment } from "./function/rating.js"

import { listEvent, fetchEvent, addEvent, editEvent, deleteEvent } from "./function/event.js"

import { fetchEventWithComment, toggleLikeEvent, addCommentEvent } from "./function/event.js"

import { checkConfirmAddress, listConfirmAddress, sendConfirmAddress, confirmAddress, deleteConfirmationAddress } from "./function/address_confirmation.js"

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
    fastify.get('/api/countUserTransaction', errorWrapper(countUserTransaction(fastify)))
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

    // Khusus event [ADMIN]
    fastify.get('/api/fetchEvent', errorWrapper(fetchEvent(fastify)))
    fastify.get('/api/listEvent', errorWrapper(listEvent(fastify)))
    fastify.post('/api/addEvent', errorWrapper(addEvent(fastify)))
    fastify.put('/api/editEvent', errorWrapper(editEvent(fastify)))
    fastify.delete('/api/deleteEvent', errorWrapper(deleteEvent(fastify)))

    // Khusus event [USER]
    fastify.get('/api/fetchEventUser', errorWrapper(fetchEventWithComment(fastify)))
    fastify.post('/api/toggleLikeEvent', errorWrapper(toggleLikeEvent(fastify)))
    fastify.post('/api/addCommentEvent', errorWrapper(addCommentEvent(fastify)))

    // Khusus delivery
    fastify.get('/api/checkConfirmationAddress', errorWrapper(checkConfirmAddress(fastify)))
    fastify.get('/api/listConfirmationAddress', errorWrapper(listConfirmAddress(fastify)))
    fastify.post('/api/sendConfirmationAddress', errorWrapper(sendConfirmAddress(fastify)))
    fastify.put('/api/confirmAddress', errorWrapper(confirmAddress(fastify)))
    fastify.delete('/api/deleteConfirmationAddress', errorWrapper(deleteConfirmationAddress(fastify)))

    // Khusus invoice generator
    fastify.post('/api/generateInvoice', async (request, reply) => {
        try {
            const invoice_api_key = process.env.INVOICE_API_KEY;
            if (!invoice_api_key) {
              reply.code(500).send({ status: false, message: "API key is missing" });
              return;
            }
        
            const fileResponse = await axios.post(
              "https://invoice-generator.com",
              request.body,
              {
                headers: {
                  Authorization: `Bearer ${invoice_api_key}`,
                  "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
              }
            );
      
            reply
              .header("Content-Type", "application/pdf")
              .header("Content-Disposition", "attachment; filename=invoice.pdf")
              .status(200)
              .send(fileResponse.data);
          } catch (error) {
            console.error("Error generating invoice:", error);
        
            reply.code(500).send({
              status: false,
              message: "Failed to generate invoice",
              error: error.message,
            });
          }
    })
}

export default routes;