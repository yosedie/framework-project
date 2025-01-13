"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, UploadPictureStruct, VerifyTokenData, EmptyData } from '../types/types';
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
  const [userDetail, setUserDetail] = React.useState<VerifyTokenData>({
    role: "",
    nama: "",
    email: "",
    telepon: "",
    picture_profile: "",
    password: "",
  });
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUserDetail((prev) => ({
      ...prev,
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

  async function changeProfile(jwt_token: string): Promise<EmptyData> {
    try {
        const response = await axios.put<ApiResponse<EmptyData>>(`/changeSecurity`, {
            jwt_token: jwt_token,
            nama: userDetail.nama,
            email: userDetail.email,
            telepon: userDetail.telepon,
            password: userDetail.password,
        });
        if(response.data.status) {
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
    setUserDetail({...userData})
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: "3.5% 0",
            }}
        >
            <Typography variant="h6" component="h6" sx={{color: "black"}}>
                Profile Data Anda
            </Typography>
            {/* <Image
                draggable={false}
                src={LoginPageImage}
                alt="Example"
                // layout="responsive"
                width={0}
                height={400}
            /> */}
            
            <Grid container size={12} spacing={6}>
              <Grid size={6}>
                <Item
                  sx={{
                    boxShadow: "0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {profilePictureRedux !== "" || profilePicture !== "" ? (
                    <Avatar
                      sx={{ width: 240, height: 240, color: "black" }}
                      src={profilePictureRedux || profilePicture}
                    />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: 240, color: "black" }} />
                  )}

                  <Button
                    variant="contained"
                    onClick={() => {
                      const imageURL = prompt("Mohon masukkan URL Image :");
                      if (imageURL) {
                        uploadPicture(imageURL as string);
                      }
                    }}
                    sx={{ marginTop: "3.5%" }}
                  >
                    Ganti Profile Gambar
                  </Button>
                </Item>
              </Grid>
              <Grid size={6}>
                <Item sx={{boxShadow: "0"}}>
                <Box sx={{width: "50%"}}>
                  <TextField 
                      name="email"
                      label="Email"
                      type='email'
                      variant="outlined"
                      sx={{marginTop: "3.5%"}}
                      fullWidth
                      value={userDetail.email}
                      onChange={handleInputChange}
                  />
                  <TextField 
                      name="nama"
                      label="Nama"
                      type='text'
                      variant="outlined"
                      sx={{marginTop: "3.5%"}}
                      fullWidth
                      value={userDetail.nama}
                      onChange={handleInputChange}
                  />
                  <TextField 
                      name="telepon"
                      label="Telepon"
                      type='tel'
                      variant="outlined"
                      sx={{marginTop: "3.5%"}}
                      fullWidth
                      value={userDetail.telepon}
                      onChange={handleInputChange}
                  />
                  <TextField 
                      name="password"
                      label="New Password"
                      type='password'
                      variant="outlined"
                      sx={{marginTop: "3.5%"}}
                      fullWidth
                      value={userDetail.password}
                      onChange={handleInputChange}
                  />
                  <br /> <Button
                      sx={{
                          marginTop: "3.5%",
                          display: "block",
                          borderRadius: 0,
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                          changeProfile(token)
                      }}
                  >
                      Ganti Profile
                  </Button>
                </Box>
                </Item>
              </Grid>
            </Grid>
            {/* <Box sx={{
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
            </Box> */}
        </Box>
    <Footer />
   </Box>
  );
}