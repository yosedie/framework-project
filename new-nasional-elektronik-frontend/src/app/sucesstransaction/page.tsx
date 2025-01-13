"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, SnapPaymentResult } from '../types/types';
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
// import Spacer from '@mui/material/Spacer';


// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { UserState, login } from '../util/redux/Features/user/userSlice';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Card from '../component/Card'
import Accordion from '../component/AccordionDashboard'

// NEXT.JS
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
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

const productsName = ["Test", "Test2"]

export default function Login() {
  const [paymentInfo, setPaymentInfo] = React.useState({
    tanggal: "",
    total: "",
    stok_transaksi: "",
    alamat: "",
    status: "pending",
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
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
 async function loginHandler(): Promise<LoginData> {
    try {
      const response = await axios.post<ApiResponse<LoginData>>('/login', loginData);
  
      if (response.data.status) {
        const token = response.data.data.jwt_token;
        const role = response.data.data.role;
  
        // Simpan data login ke Session Storage
        const userData = {
          email: loginData.email,
          jwt_token: token
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
  
        dispatch(login(response.data.data.jwt_token));
        execToast(ToastStatus.SUCCESS, response.data.message);
        if(role === "user") {
            router.push('/products');
        } else if(role === "admin") {
            router.push('/dashboard');
        } else if(role === "user") {
            router.push('/product');
        }
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }  

  React.useEffect(() => {
    const paymentInfoString = sessionStorage.getItem('payment_info');
    // alert(JSON.stringify(paymentInfoString))
    if (paymentInfoString) {
        const storedPaymentInfo: SnapPaymentResult = JSON.parse(paymentInfoString);
        setPaymentInfo((prevState) => ({
            ...prevState,
            tanggal: storedPaymentInfo.transaction_time,
            total: storedPaymentInfo.gross_amount,
            status: storedPaymentInfo.transaction_status,
            alamat: storedPaymentInfo.alamat,
            stok_transaksi: storedPaymentInfo.stok,
        }))
    }
  }, [])

  return (
   <Box sx={{backgroundColor: "white"}}>
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
        <Box
            sx={{
                marginTop: "5%",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                height: '55vh',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
            }}
        >
            <Typography variant="h5" component="p" sx={{color: "black"}}>
                {
                    paymentInfo.status === 'pending'
                    ? "Transaksi anda sedang dalam keadaan pending"
                    : "Selamat, transaksi anda berhasil"
                }
                
            </Typography>
            <div style={{marginTop: "1%"}} />
            <Avatar sx={{width: "120px", height: "120px"}} src={
                paymentInfo.status === 'pending'
                    ? "https://uxwing.com/wp-content/themes/uxwing/download/time-and-date/pending-clock-icon.png"
                    : "https://cdn-icons-png.flaticon.com/512/5610/5610944.png"
            } />
            <div style={{marginTop: "2.5%"}} />
            <Box sx={{textAlign: "left", width: "22.5%"}}>
                <Typography variant="body1" component="p" sx={{ color: "black" }}>
                    Tanggal Pembayaran: <strong>{paymentInfo.tanggal.split(" ")[0]}</strong>
                </Typography>
                <Typography variant="body1" component="p" sx={{color: "black"}}>
                    Total transaksi : <strong>Rp. {paymentInfo.total}</strong>
                </Typography>
                <Typography variant="body1" component="p" sx={{color: "black"}}>
                    Jumlah barang yang dibeli : <strong>{paymentInfo.stok_transaksi}</strong>
                </Typography>
                <Typography variant="body1" component="p" sx={{color: "black"}}>
                    Alamat dikirim ke : <strong>{paymentInfo.alamat}</strong>
                </Typography>
                <Typography variant="body1" component="p" sx={{color: "black"}}>
                    Status : <strong>{
                        paymentInfo.status === 'pending'
                            ? "Pending"
                            : "Berhasil"    
                    }</strong> 
                </Typography>
            </Box> <br />
            {
                paymentInfo.status === 'pending'
                    ? (
                        <Button variant="contained" onClick={() => router.push("/products")}>
                            Ke daftar produk
                        </Button>
                    )
                    : (
                        <Button variant="contained" onClick={() => router.push("/transaction")}>
                            Ke history transaksi
                        </Button>
                    ) 
            }
        </Box>
    <Footer />
   </Box>
  );
}