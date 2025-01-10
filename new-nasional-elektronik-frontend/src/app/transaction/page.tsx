"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, GetTransactionStruct, TransactionData, DetailsTransactionFetch, FetchTransactionStruct } from '../types/types';
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
import LoginPageImage from '../public/login_page.png'

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
  const [detailIndex, setDetailIndex] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const role = useSelector((state: RootState) => state.user.role)
  const dispatch = useDispatch()

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
  const [transactionList, setTransactionList] = React.useState<TransactionData[]>([]);
  const [transactionDetailList, setTransactionDetailList] = React.useState<DetailsTransactionFetch[]>([]);


 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value,
    }));
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
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function fetchTransaction(transactionID: string): Promise<FetchTransactionStruct> {
    try {
        const response = await axios.get<ApiResponse<FetchTransactionStruct>>(`/fetchTransaction`, {
            params: { transactionID }
        });
        if(response.data.status) {
            setTransactionDetailList(response.data.data.details)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
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

 React.useEffect(() => {
    getTransactionList()
 }, [])

  return (
   <Box sx={{backgroundColor: "white"}}>
    <Modal
    open={open}
    onClose={() => {
        handleClose()
        setDetailIndex(-1)
    }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        {
            detailIndex !== -1
            ? (
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Transaction Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Date : {(new Date(transactionList[detailIndex].tanggal)).toISOString().slice(0, 10)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Timestamp : {(new Date(transactionList[detailIndex].tanggal)).toTimeString().slice(0, 8)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Grand Total : Rp. {transactionList[detailIndex].total_harga}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Product : 
                    </Typography>
                    {
                        transactionDetailList.map(data => {
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
                                        Price : Rp. {data.product.harga}
                                    </Typography>
                                </Box>
                            )
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
            {
                transactionList.map((data, index) => {
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
                                    Total Harga : {data.total_harga}
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
                                    setDetailIndex(index)
                                    fetchTransaction(data._id)
                                }}
                                >
                                See Details
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