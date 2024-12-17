import { mongoDB } from '../index.js'

// Model 
import RegisterModel from '../models/Register.js'

const register = (fastify) => async (request, reply) => {
    const response = { 
        status: false,
        message: "",
        data: {}
    }
    const { nama, email, telepon, password, confirm_password } = {...request.body}
    const register = mongoDB.models.User || mongoDB.model('User', RegisterModel);

    if(nama === "") {
        response.message = "Nama tidak boleh kosong !"
    } else if(email === "") {
        response.message = "Email tidak boleh kosong !"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        response.message = "Email tidak valid!";
    } else if(telepon === "") {
        response.message = "Telepon tidak boleh kosong !"
    } else if (!/^\d+$/.test(telepon)) {
        response.message = "Telepon hanya boleh berisi angka!";
    } else if(password === "") {
        response.message = "Password tidak boleh kosong !"
    } else if(password !== confirm_password) {
        response.message = "Confirm password harus sama dengan password !"
    } else {
        // const formattedDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
        response.status = true
        response.message = "Register sukses !"
        const newUser = new register({ 
            ...request.body,
            tanggal_daftar: new Date(),
            role: "user",
        });
        await newUser.save();
    }
    return response
}

export default register