import { mongoDB } from '../index.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Model 
import EventModel from '../models/Event.js'
import EventCommentModel from '../models/EventComment.js'
import EventLikeModel from '../models/EventLike.js'
import RegisterModel from '../models/Register.js'

// Khusus Admin
export const listEvent = (fastify) => async (request, reply) => {
    const { user_token } = request.query;

    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel)
    const allEvent = await event.find({})
    if(user_token) {
        const decoded = jwt.verify(user_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const eventLike = mongoDB.models.EventLike || mongoDB.model('EventLike', EventLikeModel);
        const likedEvents = await eventLike.find();
        const likeCounts = likedEvents.reduce((acc, like) => {
            acc[like.id_event] = (acc[like.id_event] || 0) + 1;
            return acc;
        }, {});

        const likedEventIds = new Set(
            likedEvents.filter(like => like.id_user === decoded.userID).map(like => like.id_event)
        );

        const enrichedEvents = allEvent.map(event => ({
            ...event.toObject(),
            liked: likedEventIds.has(event._id.toString()),
            likeCount: likeCounts[event._id.toString()] || 0
        }));

        response.status = true;
        response.data.list = enrichedEvents;
    } else {
        response.status = true
        response.data.list = [
            ...allEvent
        ]
    }
    return response
}

export const fetchEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { eventID } = request.query;
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);
    const objectEventID = new mongoose.Types.ObjectId(eventID);
    const singleEvent = await event.find({_id: objectEventID});

    response.status = true
    response.data = {
        event: {...singleEvent}
    }
    return response
}

export const addEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { judul, deskripsi, gambar_url } = {...request.body}
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);

    if(judul === "") {
        response.message = "Judul tidak boleh kosong !"
    } else if(deskripsi === "") {
        response.message = "Deskripsi tidak boleh kosong !"
    } else if(gambar_url === "") {
        response.message = "Gambar tidak boleh kosong !"
    } else {
        response.status = true
        response.message = "Tambah event sukses !"
        const newEvent = new event({ 
            ...request.body,
            likeCount: 0,
            tanggal_ditambahkan: new Date(),
        });
        await newEvent.save();
    }
    return response
}

export const editEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_event, judul, deskripsi, gambar_url } = {...request.body}
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);

    if(id_event === "") {
        response.message = "ID Event tidak boleh kosong !"
    } else if(judul === "") {
        response.message = "Judul tidak boleh kosong !"
    } else if(deskripsi === "") {
        response.message = "Deskripsi tidak boleh kosong !"
    } else if(gambar_url === "") {
        response.message = "Gambar tidak boleh kosong !"
    } else {
        const objectEventID = new mongoose.Types.ObjectId(id_event);
        const existingEvent = await event.findOne({
            _id: objectEventID,
        })
        if (!existingEvent) {
            response.status = false;
            response.message = "Event tidak ditemukan!";
        } else {
            existingEvent.judul = judul;
            existingEvent.deskripsi = deskripsi;
            existingEvent.gambar_url = gambar_url;
            await existingEvent.save();

            response.status = true
            response.message = "Edit event sukses !"
            const allEvent = await event.find({})
            response.data.list = [
                ...allEvent
            ]
            
        }
    }
    return response
}

export const deleteEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { id_event } = {...request.body}
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);

    if(id_event === "") {
        response.message = "ID Event tidak boleh kosong !"
    } else {
        const objectEventID = new mongoose.Types.ObjectId(id_event);
        const deletedEvent = await event.findOneAndDelete({
            _id: objectEventID,
        })
        if (!deletedEvent) {
            response.status = false;
            response.message = "Event tidak ditemukan!";
        } else {
            response.status = true;
            response.message = "Delete event sukses !"
            const allEvent = await event.find({})
            response.data.list = [
                ...allEvent
            ]
        }
    }
    return response
}

// Khusus User
export const fetchEventWithComment = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { eventID } = request.query;
    const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
    const comment = mongoDB.models.EventComment || mongoDB.model('EventComment', EventCommentModel);
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);
    const objectEventID = new mongoose.Types.ObjectId(eventID);
    const allComments = await comment.find({id_event: eventID});
    const singleEvent = await event.findOne({_id: objectEventID}).lean();
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
    response.data = {
        event: {...singleEvent},
        comment: [...enrichedComments],
    }
    return response
}

export const toggleLikeEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    };
    const { user_token, id_event } = { ...request.body };
    const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);

    if (id_event === "") {
        response.message = "ID Event tidak boleh kosong!";
    } else if (user_token === "") {
        response.message = "Token tidak boleh kosong!";
    } else {
        const objectEventID = new mongoose.Types.ObjectId(id_event);
        const existingEvent = await event.findOne({ _id: objectEventID });

        if (!existingEvent) {
            response.message = "Event tidak ditemukan!";
        } else {
            const eventLike = mongoDB.models.EventLike || mongoDB.model('EventLike', EventLikeModel);
            const decoded = jwt.verify(user_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
            const existingLike = await eventLike.findOne({ 
                id_user: decoded.userID, 
                id_event 
            });

            if (existingLike) {
                await eventLike.deleteOne({ _id: existingLike._id });
                response.message = "Event berhasil di-unlike.";
            } else {
                const newLike = new eventLike({ 
                    id_user: decoded.userID,
                    id_event,
                    tanggal_ditambahkan: new Date(),
                });
                await newLike.save();
                response.message = "Event berhasil di-like.";
            }
            const likedEvents = await eventLike.find();
            const likeCounts = likedEvents.reduce((acc, like) => {
                acc[like.id_event] = (acc[like.id_event] || 0) + 1;
                return acc;
            }, {});

            const likedEventIds = new Set(
                likedEvents.filter(like => like.id_user === decoded.userID).map(like => like.id_event)
            );

            const allEvent = await event.find({})
            const enrichedEvents = allEvent.map(event => ({
                ...event.toObject(),
                liked: likedEventIds.has(event._id.toString()),
                likeCount: likeCounts[event._id.toString()] || 0
            }));
            response.status = true;
            response.data.list = enrichedEvents;
        }
    }

    return response
};

export const addCommentEvent = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { user_token, id_event, comment } = {...request.body}
    const Comment = mongoDB.models.EventComment || mongoDB.model('EventComment', EventCommentModel);

    if(id_event === "") {
        response.message = "ID Event tidak boleh kosong !"
    } else if(user_token === "") {
        response.message = "Token tidak boleh kosong !"
    } else if(comment === "") {
        response.message = "Comment tidak boleh kosong !"
    } else {
        const decoded = jwt.verify(user_token, process.env.private_key_jwt, { algorithms: ['HS512'] });
        const newComment = new Comment({ 
            ...request.body,
            id_user: decoded.userID,
            tanggal_ditambahkan: new Date(),
        });
        await newComment.save();

        const User = mongoDB.models.User || mongoDB.model('User', RegisterModel);
        const comment = mongoDB.models.EventComment || mongoDB.model('EventComment', EventCommentModel);
        const event = mongoDB.models.Event || mongoDB.model('Event', EventModel);
        const objectEventID = new mongoose.Types.ObjectId(id_event);
        const allComments = await comment.find({id_event: id_event});
        const singleEvent = await event.findOne({_id: objectEventID}).lean();
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
        response.message = "Tambah comment sukses !"
        response.data = {
            event: {...singleEvent},
            comment: [...enrichedComments],
        }
    }
    return response
}