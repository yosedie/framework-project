import helloWorld from "./function/helloWorld.js";

async function routes (fastify, options) {
    const errorWrapper = (fn) => (request, reply) => {
        return fn(request, reply).catch(err => {
            fastify.error(err.message);
            reply.status(500).send({ error: 'Internal Server Error' });
        });
    };
    
    fastify.get('/', errorWrapper(helloWorld(fastify)))
}

export default routes;