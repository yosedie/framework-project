import { mongoDB } from '../index.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Model 
import RatingModel from '../models/Rating.js'
import RegisterModel from '../models/Register.js'

export const listComment = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_product } = request.query
    const Comment = mongoDB.models.Rating || mongoDB.model('Rating', RatingModel);
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
    if(id_product === "") {
        response.message = "ID Product tidak boleh kosong !"
    } else {
        const allComments = await Comment.find({ id_product });
        const enrichedComments = await Promise.all(
            allComments.map(async (comment) => {
            const user = await User.findOne({ _id: comment.id_user });
            return {
                ...comment.toObject(),
                user: user ? { nama: user.nama, picture_profile: user.picture_profile } : null,
            };
            })
        );
        response.status = true
        response.data.list = [
            ...enrichedComments
        ]
    }
    return response
}

export const postComment = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { jwt_token, id_product, rating, komentar } = {...request.body}
    const Comment = mongoDB.models.Rating || mongoDB.model('Rating', RatingModel);
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
    if(jwt_token === "") {
        response.message = "Token tidak boleh kosong !"
    } else if(id_product === "") {
        response.message = "ID Product tidak boleh kosong !"
    } else if(rating <= 0) {
        response.message = "Rating tidak boleh kosong !"
    } else if(komentar === "") {
        response.message = "Komentar tidak boleh kosong !"
    } else {
        const decoded = jwt.verify(jwt_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const newComment = new Comment({ 
            ...request.body,
            id_user: decoded.userID
        });
        await newComment.save();

        const allComments = await Comment.find({ id_product });
        const enrichedComments = await Promise.all(
            allComments.map(async (comment) => {
            const user = await User.findOne({ _id: comment.id_user });
            return {
                ...comment.toObject(),
                user: user ? { nama: user.nama, picture_profile: user.picture_profile } : null,
            };
            })
        );
        response.status = true
        response.message = "Post komentar sukses !"
        response.data.list = [
            ...enrichedComments
        ]
    }
    return response
}