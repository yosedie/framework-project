// enum

export interface SortConfig {
    order: string;
    orderBy: string;
}

export enum Kategori {
    MesinCuci = "Mesin Cuci",
    AC = "Air Conditioner",
    Kulkas = "Kulkas",
    Kompor = "Kompor",
    RiceCooker = "Rice Cooker",
    TV = "Televisi",
    Anthena = "Anthena",
    FreezeBox = "Freezer Box",
}

export const KategoriData = [
    Kategori.MesinCuci,
    Kategori.AC,
    Kategori.Kulkas,
    Kategori.Kompor,
    Kategori.RiceCooker,
    Kategori.TV,
    Kategori.Anthena,
    Kategori.FreezeBox,
];

export enum Role {
    User,
    Seller,
    Admin
}

// interface
interface VirtualAccount {
    bank: string;
    va_number: string;
}
  
export interface SnapPaymentResult {
    // pribadi
    alamat: string;
    stok: string;

    // dari midtrans
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status: string;
    va_numbers?: VirtualAccount[];
    pdf_url?: string;
    finish_redirect_url?: string;
}

export interface ProductStruct {
    id_produk?: string,
    nama_produk: string,
    kategori_id: number,
    rating?: number,
    harga: number,
    status: number,
    stok: number,
    deskripsi: string,
    tanggal_ditambahkan?: Date,
    gambar_url?: string,
}

export interface EventStruct {
    _id?: string,
    judul: string,
    deskripsi: string,
    gambar_url?: string,
    tanggal_ditambahkan: string,
    likeCount?: number,
    liked?: boolean,
}

export interface VerifyTokenData {
    role: string,
    nama: string,
    email: string,
    telepon: string,
    picture_profile: string,
    password?: string,
}

export interface FetchTransactionCount {
    count: number
}

export interface FetchProductStruct {
    product: ProductStruct[]
}

export interface FetchEventStruct {
    event: EventStruct[]
}

export interface GetProductStruct {
    list: ProductStruct[]
}

export interface GetTransactionStruct {
    list: TransactionData[]
}

export interface FetchTransactionStruct {
    details: DetailsTransactionFetch[]
}

export interface GetUserStruct {
    list: UserData[]
}

export interface GetEventStruct {
    list: EventStruct[]
}

export interface GetEventWithCommentStruct {
    event: EventStruct;
    comment: UserCommentEvent[];
}

export interface UserCommentEvent {
    id_user: string,
    id_event: string,
    comment: string,
    tanggal_ditambahkan: string,
    user: UserRating
}

export interface LoginData {
    jwt_token: string;
    role: string;
}

export interface UploadPictureStruct {
    picture_profile: string;
}

export interface RatingStruct {
    list: ListRating[];
}

export interface EmptyData {

}

export interface MidtransTokenData {
    token: string;
    redirect_url: string;
}

export interface TransactionData {
    _id: string;
    id_pelanggan: string;
    total_harga: number;
    tanggal: string;
    status: string;
    metode_pembayaran: string;
    alamat_pengiriman: string;
    nomor_resi: string;
    id_pengiriman: string;
    nama_pelanggan: string;
}

export interface DetailsTransactionFetch {
    _id: string;
    id_h_trans: string;
    id_produk: string;
    jumlah: number;
    harga: number;
    product: ProductStruct;
}

export interface UserData {
    _id: string;
    role: string;
    nama: string;
    email: string;
    telepon: string;
    password: string;
    tanggal_daftar: string;
}

export interface ListRating {
    id_user: string,
    id_product: string,
    rating: string,
    komentar: string,
    user: UserRating,
}

export interface UserRating {
    nama: string,
    picture_profile: string,
}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}