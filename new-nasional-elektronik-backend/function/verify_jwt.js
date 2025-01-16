import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.configDotenv()

// Model 
import RegisterModel from '../models/Register.js'
import ConfirmAddressModel from '../models/ConfirmAddress.js'

const verifyJWT = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { jwt_token } = {...request.body}
    if(jwt_token !== "") {
        const confirmAddress = mongoDB.models.ConfirmAddress || mongoDB.model('ConfirmAddress', ConfirmAddressModel);
        const userModel = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const UserID = new mongoose.Types.ObjectId(decoded.userID);
        const user = await userModel.findOne({ _id: UserID})
        const address = await confirmAddress.findOne({ id_user: UserID });

        response.status = true
        response.message = ""
        response.data = {
            nama: user.nama,
            email: user.email,
            role: user.role,
            telepon: user.telepon,
            picture_profile: user.picture_profile,
            alamat: address ? address.nama_jalan : "",
        }
    }
    return response
}

export default verifyJWT