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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Spacer from '@mui/material/Spacer';


// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { AccountStruct, loginAccount } from '../util/redux/Features/account/accountSlice';
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
        const response = await axios.post<ApiResponse<LoginData>>(`/login`, {
            ...loginData
        });
        if(response.data.status) {
            const savedData: AccountStruct = {
                jwt_token: response.data.data.jwt_token,
            }
            dispatch(loginAccount(savedData))
            execToast(ToastStatus.SUCCESS, response.data.message)
            router.push("/products")
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

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
        <Box sx={{margin: "1.5% 2.5%"}}>
            <Typography variant="h5" color='black'>
                Shopping Cart
            </Typography>
            <Card 
                title='test'
                description='test'
                isHorizontal={true}
                fullWidth={true}
                withImage={true}
            /> <br />
            <Card 
                title='Total Purchased Item : 12'
                description='Grand Total : Rp. 1.000.000'
                isDescriptionTitle={true}
                isHorizontal={true}
                fullWidth={true}
                withImage={false}
                marginTopParam='20vh'
            />
        </Box>
    <Footer />
   </Box>
  );
}