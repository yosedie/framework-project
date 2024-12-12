import { mongoDB } from '../index.js'

// Model 
import User from '../models/Register.js'

const helloWorld = (fastify) => async (request, reply) => {
    const user = mongoDB.model('User', User);
    const newUser = new user({ 
        name: "RazorZinc",
        age: 15,
    });
    await newUser.save();
    return { hello: 'world' }
}

export default helloWorld