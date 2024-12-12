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

export interface LoginData {
    jwt_token: string;
}

export interface RegisterData {

}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}