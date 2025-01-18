'use strict'

import Fastify from 'fastify';
import cors from 'cors';
import fastifyLog from 'fastify-log';
import fastifyMongooseAPI from 'fastify-mongoose-api';
import fastifyFormbody from '@fastify/formbody';
import fastifyCors from 'fastify-cors'; // Gunakan @fastify/cors
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import routes from './router.js';

configDotenv()

if (!process.env.db_url || !process.env.port) {
    console.error('Environment variables db_url or port are missing!');
    process.exit(1);
}

const mongooseConnection = mongoose.createConnection(process.env.db_url);
mongooseConnection.on('connected', () => {
    console.log('MongoDB connected successfully');
});
mongooseConnection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const start = async () => {
    const fastify = Fastify({ logger: true });
    fastify.register(routes);
    fastify.register(fastifyLog);
    fastify.register(fastifyFormbody);
    fastify.register(fastifyCors, { 
        origin: '*', // Batasi sesuai kebutuhan jika perlu
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })      
    fastify.register(fastifyMongooseAPI, {
        models: mongooseConnection.models,
        prefix: '/api/',
        setDefaults: true,
        methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options']
    });
    fastify.setErrorHandler((error, request, reply) => {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    });
    
    await fastify.ready();
    const port = process.env.PORT || 8000; // Menggunakan port yang diberikan oleh Cloud Run atau fallback ke 8000
    await fastify.listen({ port }, (err, address) => {
        if (err) {
            fastify.error(err)
            process.exit(1)
        }
        fastify.info(`Server listening at ${address}`);
    });

};

start()
export const mongoDB = mongooseConnection;