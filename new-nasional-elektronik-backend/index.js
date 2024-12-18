'use strict'

import Fastify from 'fastify';
import cors from 'cors';
import fastifyLog from 'fastify-log';
import fastifyMongooseAPI from 'fastify-mongoose-api';
import fastifyFormbody from '@fastify/formbody';
import fastifyCors from 'fastify-cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import routes from './router.js';

configDotenv()

const mongooseConnection = mongoose.createConnection(process.env.db_url);
const start = async () => {
    const fastify = Fastify();
    fastify.register(routes);
    fastify.register(fastifyLog);
    fastify.register(fastifyFormbody);
    fastify.register(fastifyCors, { 
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })      
    fastify.register(fastifyMongooseAPI, {
        models: mongooseConnection.models,
        prefix: '/api/',
        setDefaults: true,
        methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options']
    });
  
    await fastify.ready();
    await fastify.listen({ port: process.env.port }, (err, address) => {
        if (err) {
            fastify.error(err)
            process.exit(1)
        }
        fastify.info(`Server listening at ${address}`);
    });
};

start()
export const mongoDB = mongooseConnection;