/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse } from '../types/types';
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

const productsName = ["Test", "Test2"]

export default function Login() {
  const router = useRouter()
  const count = useSelector((state: RootState) => state.counter.value)
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
        } else if(role === "penjual") {
            router.push('/products')
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

  const handlePaymentDispatch = () => {
    const paymentData = "20 Desember 2024"; // Data pembayaran contoh
    // dispatch(setPaymentInfo(paymentData)); // Dispatch ke Redux
    router.push('/sucesstransaction'); // Arahkan ke halaman successTransaction
};


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

            <Grid 
                container 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '0 auto',
                }}
            >
                <Grid size={6}>
                    <Item>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                draggable={false}
                                src={LoginPageImage}
                                alt="Example"
                                // layout="responsive"
                                width={0}
                                height={400}
                            />
                            <Typography variant="h6" component="h6" sx={{color: "black"}}>
                                Jual beli murah hanya di National Electronic
                            </Typography>
                            <Typography variant="overline" component="h6" sx={{color: "black"}}>
                                Gabung dan rasakan kemudahan bertransaksi di National Electronic
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '60vh',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                            }}
                        >
                            <Avatar sx={{width: "120px", height: "120px"}} />
                            <div style={{marginTop: "1.75%"}} />
                            <TextField 
                                name="email"
                                value={loginData.email} 
                                type="email" 
                                label="Email" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%" }} 
                                onChange={handleChange} 
                            />
                            <TextField 
                                name="password"
                                value={loginData.password} 
                                type="password" 
                                label="Password" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%" }} 
                                onChange={handleChange} 
                            />
                            <Button variant="contained" onClick={loginHandler}>
                                Login
                            </Button> <br />

                            <Typography variant="body2" component="p" sx={{color: "black"}}>
                                Belum memiliki akun ? <Link href="#" variant="body2" onClick={() => handleRoute("register")}>
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
    <Footer />
   </Box>
  );
}