import { mongoDB } from '../index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.configDotenv()

// Model 
import RegisterModel from '../models/Register.js'

const login = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { email, password } = {...request.body}
    const login = mongoDB.models.User || mongoDB.model('User', RegisterModel);

    if(email === "") {
        response.message = "Email tidak boleh kosong !"
    } else if(password === "") {
        response.message = "Password tidak boleh kosong !"
    } else {
        const user = await login.findOne({ email: email, password: password });
        if (user) {
            response.status = true;
            response.message = "Login sukses !";
            var token = jwt.sign({ userID: user._id.toString() }, process.env.private_key_jwt, { algorithm: 'HS512' });
            response.data = {
                jwt_token: token
            }
        } else {
            response.message = "Email atau password salah!";
        }
    }
    return response
}

export default login