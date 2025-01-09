"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, UploadPictureStruct } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
import { UserState, changePictureProfile } from '../util/redux/Features/user/userSlice';
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

export default function DashboardAdmin() {
  const router = useRouter()
  const profilePictureRedux = useSelector((state: RootState) => state.user.userData.picture_profile)
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const userData = useSelector((state: RootState) => state.user.userData)
  const dispatch = useDispatch()

  const [profilePicture, setProfilePicture] = React.useState("")
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
 async function uploadPicture(imageUrl: string): Promise<UploadPictureStruct> {
    try {
      const response = await axios.put<ApiResponse<UploadPictureStruct>>('/uploadImage', {
        image_url: imageUrl,
        jwt_token: token,
      });
  
      if (response.data.status) {
        setProfilePicture(response.data.data.picture_profile)
        dispatch(changePictureProfile(response.data.data.picture_profile));
        execToast(ToastStatus.SUCCESS, response.data.message);
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: "2% 0",
            }}
        >
            {/* <Image
                draggable={false}
                src={LoginPageImage}
                alt="Example"
                // layout="responsive"
                width={0}
                height={400}
            /> */}

            {
              profilePictureRedux !== "" || profilePicture !== ""
              ? <Avatar sx={{ width: 240, height: 240, color: "black" }} src={profilePictureRedux || profilePicture} />
              : <AccountCircleIcon sx={{ fontSize: 240, color: "black" }} />
            }
            
            <Button variant="contained" onClick={() => {
              const imageURL = prompt("Mohon masukkan URL Image :")
              if(imageURL) {
                uploadPicture(imageURL as string)
              }
            }} sx={{marginTop: "1.5%"}}>
              Ganti Profile Gambar
            </Button>
            <Typography variant="h6" component="h6" sx={{color: "black", marginTop: "2.5%"}}>
                Profile Data Anda
            </Typography>
            <Box sx={{
              border: "1px solid black",
              padding: ".75%",
            }}>
              <Typography variant="body1" component="h6" sx={{color: "black"}}>
                  Role : <strong>{userData.role}</strong>
              </Typography>
              <Typography variant="body1" component="h6" sx={{color: "black"}}>
                  Nama : <strong>{userData.nama}</strong>
              </Typography>
              <Typography variant="body1" component="h6" sx={{color: "black"}}>
                  Email : <strong>{userData.email}</strong>
              </Typography>
              <Typography variant="body1" component="h6" sx={{color: "black"}}>
                  Telepon : <strong>+{userData.telepon}</strong>
              </Typography>
            </Box>
            
        </Box>
    <Footer />
   </Box>
  );
}