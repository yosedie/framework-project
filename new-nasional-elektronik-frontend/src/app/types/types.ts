// enum

export enum Role {
    User,
    Seller,
    Admin
}

// interface
export interface ProductStruct {
    id_produk: string,
    nama_produk: string,
    kategori: string,
    harga: number,
    stok: number,
    deskripsi: string,
    tanggal_ditambahkan: Date,
    gambar_url: string,
    status: string,
}

export interface VerifyTokenData {
    role: string;
}

export interface AddData {

}

export interface LoginData {
    jwt_token: string;
    role: string;
}

export interface RegisterData {

}
export interface MidtransTokenData {
    token: string;
    redirect_url: string;
}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}