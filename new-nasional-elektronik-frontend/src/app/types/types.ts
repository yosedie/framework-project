// enum

export enum Role {
    User,
    Seller,
    Admin
}

// interface
export interface ProductStruct {
    id_produk?: string,
    nama_produk: string,
    kategori_id: number,
    harga: number,
    status: number,
    stok: number,
    deskripsi: string,
    tanggal_ditambahkan?: Date,
    gambar_url?: string,
}

export interface FetchProductStruct {
    product: ProductStruct[]
}

export interface GetProductStruct {
    list: ProductStruct[]
}

export interface VerifyTokenData {
    role: string;
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