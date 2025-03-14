/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { GetConfirmAddressStruct, ConfirmAddressData, FetchTransactionCount, ApiResponse, GetTransactionStruct, TransactionData, DetailsTransactionFetch, FetchTransactionStruct } from '../types/types';
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
  const [confirmationAddressDetail, setConfirmationAddressDetail] = React.useState<ConfirmAddressData>({
    kota: "",
    kode_zip: "",
    nama_jalan: "",
    provinsi: "",
    tanggal_ditambahkan: "",
    nomor_hp: "",
    status: -1,
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const role = useSelector((state: RootState) => state.user.role)
  const nama = useSelector((state: RootState) => state.user.userData.nama)
  const invoice_api_key = useSelector((state: RootState) => state.user.invoice_api_key)
  const dispatch = useDispatch()

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
  const [confirmationAddressList, setConfirmationAddressList] = React.useState<ConfirmAddressData[]>([]);
  const [confirmationAddressListFiltered, setConfirmationAddressListFiltered] = React.useState<ConfirmAddressData[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");

 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = event.target;
     setSearchValue(value)
     if(value.length === 0) {
        setConfirmationAddressListFiltered([...confirmationAddressList])
     } else {
        const transactionFiltered = [...confirmationAddressList].filter((item) =>
            item.kota.toLowerCase().includes(value.toLowerCase()) ||
            item.nama_jalan.toLowerCase().includes(value.toLowerCase()) ||
            item.kode_zip.toLowerCase().includes(value.toLowerCase()) ||
            item.provinsi.toLowerCase().includes(value.toLowerCase())
        );
        setConfirmationAddressListFiltered([...transactionFiltered])
     }
};

 async function getConfirmationAddressList(): Promise<GetConfirmAddressStruct> {
    try {
        const response = await axios.get<ApiResponse<GetConfirmAddressStruct>>(`/listConfirmationAddress`);
        if(response.data.status) {
            setConfirmationAddressList(response.data.data.list)
            setConfirmationAddressListFiltered(response.data.data.list)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function confirmAddress(id_confirm_address: string, status_code: number): Promise<GetConfirmAddressStruct> {
    try {
        const response = await axios.put<ApiResponse<GetConfirmAddressStruct>>(`/confirmAddress`, {
            id_confirm_address,
            status_code
        });
        if(response.data.status) {
            setConfirmationAddressList(response.data.data.list)
            setConfirmationAddressListFiltered(response.data.data.list)
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

 async function deleteConfirmAddress(id_confirm_address: string): Promise<GetConfirmAddressStruct> {
    try {
        const response = await axios.delete<ApiResponse<GetConfirmAddressStruct>>(`/deleteConfirmationAddress`, {
            data: {
                id_confirm_address
            }
        });
        if(response.data.status) {
            setConfirmationAddressList(response.data.data.list)
            setConfirmationAddressListFiltered(response.data.data.list)
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
    getConfirmationAddressList()
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
                        Confirmation Address Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Date : {(new Date(confirmationAddressDetail.tanggal_ditambahkan as string)).toISOString().slice(0, 10)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Timestamp : {(new Date(confirmationAddressDetail.tanggal_ditambahkan as string)).toTimeString().slice(0, 8)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Status : <strong style={{
                            color: confirmationAddressDetail.status === 0
                                ? "orange"
                                : confirmationAddressDetail.status === 1
                                    ? "green"
                                    : "red"
                        }}>
                            {confirmationAddressDetail.status === 0 ? "Pending" : confirmationAddressDetail.status === 1 ? "Approved" : "Rejected"}
                        </strong>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Provinsi : {confirmationAddressDetail.provinsi}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Kota : {confirmationAddressDetail.kota}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Nama Jalan : {confirmationAddressDetail.nama_jalan}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Kode Zip : {confirmationAddressDetail.kode_zip}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Nomor HP : <strong>{confirmationAddressDetail.nomor_hp}</strong>
                    </Typography>
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
                Confirm Address List
            </Typography>
            <TextField 
                value={searchValue}
                id="outlined-basic" 
                label="Search Address Confirmation" 
                variant="outlined" 
                sx={{marginTop: "2.5%"}}
                fullWidth
                onChange={handleInputChange}
            />
            {
                confirmationAddressListFiltered.length === 0 && (
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
                confirmationAddressListFiltered.map((data, index) => {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', marginTop: "1.5%" }}>
                            <Card sx={{ flexGrow: 1, minWidth: 275 }}>
                                <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {((new Date(data.tanggal_ditambahkan as string)).toISOString().slice(0, 10))} {((new Date(data.tanggal_ditambahkan as string)).toTimeString().slice(0, 8))}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    Nama Pelanggan : {data.user?.nama}
                                </Typography>
                                {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                    Metode Pembayaran : {data.metode_pembayaran}
                                </Typography> */}
                                <Typography variant="body1">
                                Status : <strong style={{
                                    color: data.status === 0
                                        ? "orange"
                                        : data.status === 1
                                            ? "green"
                                            : "red"
                                }}>
                                    {data.status === 0 ? "Pending" : data.status === 1 ? "Approved" : "Rejected"}
                                </strong>
                                <br />
                                Alamat : {data.nama_jalan}
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
                                        setConfirmationAddressDetail({...data})
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
                                    color="success"
                                    onClick={() => {
                                        confirmAddress(data._id as string, 1)
                                    }}
                                >
                                    Approve
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        confirmAddress(data._id as string, 2)
                                    }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteConfirmAddress(data._id as string)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    )
                })
            }            
        </Box>
    <Box sx={{marginTop: "12.5%"}}></Box>
    <Footer />
   </Box>
  );
}