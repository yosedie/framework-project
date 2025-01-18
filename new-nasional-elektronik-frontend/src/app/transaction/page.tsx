/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { FetchTransactionCount, ApiResponse, GetTransactionStruct, TransactionData, DetailsTransactionFetch, FetchTransactionStruct } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
// import Spacer from '@mui/material/Spacer';


// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { UserState, login, removeFromCart, removeAllFromCart } from '../util/redux/Features/user/userSlice';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';
import { ProductStruct } from '../types/types';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Accordion from '../component/AccordionDashboard'

// NEXT.JS
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import logoInvoice from '../public/logo_invoice.png'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow: 'none',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: "black",
    maxHeight: 600,
    overflowY: 'auto',
};

const productsName = ["Test", "Test2"]

export interface CartProduct extends ProductStruct {
    quantity: number;
}


export default function Transaction() {
  const [detailID, setDetailID] = React.useState("");
  const [detailTransaction, setDetailTransaction] = React.useState<TransactionData>({
    _id: "",
    id_pelanggan: "",
    id_pengiriman: "",
    alamat_pengiriman: "",
    metode_pembayaran: "",
    nama_pelanggan: "",
    nomor_resi: "",
    status: "",
    tanggal: "",
    total_harga: -1,
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const role = useSelector((state: RootState) => state.user.role)
  const nama = useSelector((state: RootState) => state.user.userData.nama)
  const address = useSelector((state: RootState) => state.user.userData.alamat)
  const invoice_api_key = useSelector((state: RootState) => state.user.invoice_api_key)
  const dispatch = useDispatch()

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
  const [transactionList, setTransactionList] = React.useState<TransactionData[]>([]);
  const [transactionListFiltered, setTransactionListFiltered] = React.useState<TransactionData[]>([]);
  const [transactionDetailList, setTransactionDetailList] = React.useState<DetailsTransactionFetch[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");

 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = event.target;
     setSearchValue(value)
     if(value.length === 0) {
        setTransactionListFiltered([...transactionList])
     } else {
        const transactionFiltered = [...transactionList].filter((item) =>
            item.alamat_pengiriman.toLowerCase().includes(value.toLowerCase()) ||
            item.nama_pelanggan.toLowerCase().includes(value.toLowerCase())
        );
        setTransactionListFiltered([...transactionFiltered])
     }
};

 async function getTransactionList(): Promise<GetTransactionStruct> {
    try {
        const response = await axios.get<ApiResponse<GetTransactionStruct>>(`/listTransaction`, {
            params: {
                jwt_token: token,
                role: role,
            }
        });
        if(response.data.status) {
            setTransactionList(response.data.data.list)
            setTransactionListFiltered(response.data.data.list)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function getTransactionCount(): Promise<FetchTransactionCount> {
    try {
        const response = await axios.get<ApiResponse<FetchTransactionCount>>(`/countUserTransaction`, {
            params: {
                jwt_token: token
            }
        });
        if(response.data.status) {
            return response.data.data
        }
        return response.data.data;
    } catch (error) {
        alert(error)
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function fetchInvoice(detailData: DetailsTransactionFetch[]): Promise<void> {
    try {
        const items = detailData.map((detail) => ({
            name: detail.product.nama_produk,
            quantity: detail.jumlah,
            unit_cost: detail.harga,
        }));

        const noTransaction = await getTransactionCount()
        const payload = {
            from: "Toko New Nasional",
            to: nama,
            number: noTransaction.count,
            items: items,
            notes: "Terimakasih sudah berbelanja di toko new nasional !",
            currency: "idr",
            logo: "https://i.ibb.co.com/bFrVFLm/logo-invoice.png",
            ship_to: address,
        };

        const response = await axios.post<ArrayBuffer>("/generateInvoice", payload, {
            headers: {
              Authorization: `Bearer ${invoice_api_key}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function fetchTransaction(transactionID: string): Promise<DetailsTransactionFetch[]> {
    try {
        const response = await axios.get<ApiResponse<FetchTransactionStruct>>(`/fetchTransaction`, {
            params: { transactionID }
        });
        if(response.data.status) {
            setTransactionDetailList(response.data.data.details)
            return response.data.data.details
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data.details;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function deleteTransaction(id_transaksi: string): Promise<GetTransactionStruct> {
    try {
        const response = await axios.delete<ApiResponse<GetTransactionStruct>>(`/deleteTransaction`, {
            data: {
                id_transaksi
            }
        });
        if(response.data.status) {
            setTransactionList(response.data.data.list)
            setTransactionListFiltered(response.data.data.list)
            execToast(ToastStatus.SUCCESS, response.data.message)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 const handleClick = async (transactionID: string): Promise<void> => {
    try {
        const dataDetails = await fetchTransaction(transactionID); 
        await fetchInvoice(dataDetails);
    } catch (error) {
        console.error("Error:", error);
    }
 };

 React.useEffect(() => {
    getTransactionList()
 }, [])

  return (
   <Box sx={{backgroundColor: "white"}}>
    <Modal
    open={open}
    onClose={() => {
        handleClose()
        setDetailID("")
    }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        {
            detailID !== ""
            ? (
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Transaction Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Date : {(new Date(detailTransaction.tanggal)).toISOString().slice(0, 10)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Timestamp : {(new Date(detailTransaction.tanggal)).toTimeString().slice(0, 8)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Grand Total : {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detailTransaction.total_harga)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Product : 
                    </Typography>
                    {
                        transactionDetailList.map(data => {
                            if(data.product) {
                                return (
                                    <Box sx={{border: "1px solid black", padding: "2.5%", marginTop: "2.5%"}}>
                                        <Image
                                            draggable={false}
                                            src={data.product.gambar_url ? data.product.gambar_url as string : ""}
                                            alt="Example"
                                            width={100}
                                            height={100}
                                            style={{ objectFit: "cover" }}
                                        />
                                        <Typography id="modal-modal-description">
                                            Name : {data.product.nama_produk}
                                        </Typography>
                                        <Typography id="modal-modal-description">
                                            Quantity : {data.jumlah}
                                        </Typography>
                                        <Typography id="modal-modal-description">
                                            Price : {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.product.harga)}
                                        </Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            )
            : <></>
        }
    </Modal>
    <AppBar />
        {/* <button 
            className={styles.button}
            onClick={() => dispatch(increment())}
        >Increment</button>
        <span>{count}</span>
        <button 
            className={styles.button}
            onClick={() => dispatch(decrement())}
        >Decrement</button>
        <button 
            className={styles.button}
            onClick={() => dispatch(incrementByAmount(2))}
        >Increment by 2</button>
        <button onClick={() => router.push("/admin")}>
            to Admin
        </button> */}
        <Box sx={{margin: "1.5% 2.5%"}}>
            <Typography variant="h5" color='black'>
                Transaction History
            </Typography>
            <TextField 
                value={searchValue}
                id="outlined-basic" 
                label="Search Transaction History" 
                variant="outlined" 
                sx={{marginTop: "2.5%"}}
                fullWidth
                onChange={handleInputChange}
            />
            {
                transactionListFiltered.length === 0 && (
                    <Box>
                        <Typography variant="h5" color='black' textAlign={"center"} sx={{
                            margin: "12% 0"
                        }}>
                            Data / Pencarian Transaksi kosong !
                        </Typography>
                    </Box>
                )
            }
            {
                transactionListFiltered.map((data, index) => {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', marginTop: "1.5%" }}>
                            <Card sx={{ flexGrow: 1, minWidth: 275 }}>
                                <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {((new Date(data.tanggal)).toISOString().slice(0, 10))} {((new Date(data.tanggal)).toTimeString().slice(0, 8))}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    Nama Pelanggan : {data.nama_pelanggan}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                    Metode Pembayaran : {data.metode_pembayaran}
                                </Typography>
                                <Typography variant="body1">
                                    Status : <strong style={{
                                        color: data.status.toLocaleLowerCase() === "pending"
                                            ? "orange"
                                            : data.status.toLocaleLowerCase() === "success"
                                                ? "green"
                                                : "red"
                                    }}>{data.status}</strong><br />
                                    Alamat : {data.alamat_pengiriman} <br />
                                    Total Harga : {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_harga)}
                                </Typography>
                                </CardContent>
                            </Card>
                            <Box
                                sx={{
                                width: '20%', // 20% width of the container
                                height: '100%', // Full height of the container
                                display: 'flex',
                                flexDirection: 'column', // Align buttons vertically
                                }}
                            >
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleOpen()
                                        setDetailID(data._id as string)
                                        setDetailTransaction({...data})
                                        fetchTransaction(data._id)
                                    }}
                                >
                                    See Details
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        handleClick(data._id)
                                    }}
                                >
                                    Print Invoice
                                </Button>
                                {
                                    role === "admin" && (
                                    <Button
                                        sx={{
                                            flex: 1,
                                            borderRadius: 0,
                                        }}
                                        variant="contained"
                                        color="error"
                                        onClick={() => deleteTransaction(data._id)}
                                    >
                                        Delete
                                    </Button>
                                    )
                                }
                            </Box>
                        </Box>
                    )
                })
            }            
        </Box>
    <Footer />
   </Box>
  );
}