import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.configDotenv()

// Model 
import RegisterModel from '../models/Register.js'

const verifyJWT = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { jwt_token } = {...request.body}
    if(jwt_token !== "") {
        const userModel = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const UserID = new mongoose.Types.ObjectId(decoded.userID);
        const user = await userModel.findOne({ _id: UserID})
        response.status = true
        response.message = "TEST"
        console.log(user.role)
        response.data = {
            role: user.role
        }
    }
    return response
}

export default verifyJWT