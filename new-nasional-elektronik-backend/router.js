import helloWorld from "./function/helloWorld.js";
import register from "./function/register.js";
import login from "./function/login.js";

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
}

export default routes;