/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { EventStruct, FetchEventStruct, ApiResponse } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';
import { Suspense } from "react";

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
import PlaceholderImage from '../public/placeholder_edit_product.jpg'

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

export default function EditAddEvent() {
  // const searchParams = useSearchParams()
  // const param = searchParams.get("key");


  // const isAdd : boolean = searchParams.get('add') === "1"
  const [isAdd, setIsAdd] = React.useState<boolean>(false);

  const router = useRouter()
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  const [eventImage, setEventImage] = React.useState("")
  const [addEventData, setAddEventData] = React.useState<EventStruct>({
    judul: "",
    deskripsi: "",
    gambar_url: "",
    tanggal_ditambahkan: "",
 });
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddEventData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // async function fetchSingleEventHandler(): Promise<FetchEventStruct> {
  //   try {
  //     const eventID = searchParams.get('id')
  //     const response = await axios.get<ApiResponse<FetchEventStruct>>('/fetchEvent', {
  //       params: {
  //           eventID
  //       }
  //     });
  
  //     if (response.data.status) {
  //       const selectedEvent = {...response.data.data.event[0]}
  //       const {gambar_url} = selectedEvent
  //       setEventImage(gambar_url as string)
  //       setAddEventData(selectedEvent)
  //     } else {
  //       execToast(ToastStatus.ERROR, response.data.message);
  //     }
  
  //     return response.data.data;
  //   } catch (error) {
  //     execToast(ToastStatus.ERROR, JSON.stringify(error));
  //     throw error;
  //   }
  // }

  async function fetchSingleEventHandler(): Promise<FetchEventStruct> {
    try {
      const eventID =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('id')
          : null;
  
      if (!eventID) {
        execToast(ToastStatus.ERROR, 'Event ID tidak ditemukan.');
        return Promise.reject('Event ID missing.');
      }
  
      const response = await axios.get<ApiResponse<FetchEventStruct>>('/fetchEvent', {
        params: { eventID },
      });
  
      if (response.data.status) {
        const selectedEvent = { ...response.data.data.event[0] };
        const { gambar_url } = selectedEvent;
        setEventImage(gambar_url as string);
        setAddEventData(selectedEvent);
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }  

  // async function addEventHandler(): Promise<EventStruct> {
  //   try {
  //     const response = await axios.post<ApiResponse<EventStruct>>('/addEvent', {
  //       ...addEventData, 
  //       gambar_url: eventImage
  //     });
  
  //     if (response.data.status) {
  //       execToast(ToastStatus.SUCCESS, response.data.message)
  //       router.push("/manageevent")
  //     } else {
  //       execToast(ToastStatus.ERROR, response.data.message);
  //     }
  
  //     return response.data.data;
  //   } catch (error) {
  //     execToast(ToastStatus.ERROR, JSON.stringify(error));
  //     throw error;
  //   }
  // }  
  function addEventHandler(): Promise<EventStruct> {
    return axios.post<ApiResponse<EventStruct>>('/addEvent', {
      ...addEventData,
      gambar_url: eventImage,
    })
      .then(response => {
        if (response.data.status) {
          execToast(ToastStatus.SUCCESS, response.data.message);
          router.push("/manageevent");
        } else {
          execToast(ToastStatus.ERROR, response.data.message);
        }
        return response.data.data;
      })
      .catch(error => {
        execToast(ToastStatus.ERROR, JSON.stringify(error));
        throw error;
      });
  }
  // function editEventHandler(): Promise<EventStruct> {
  //   const id_event = searchParams.get('id');
  //   return axios.put<ApiResponse<EventStruct>>('/editEvent', {
  //     ...addEventData,
  //     gambar_url: eventImage,
  //     id_event: id_event,
  //   })
  //     .then(response => {
  //       if (response.data.status) {
  //         execToast(ToastStatus.SUCCESS, response.data.message);
  //       } else {
  //         execToast(ToastStatus.ERROR, response.data.message);
  //       }
  //       return response.data.data;
  //     })
  //     .catch(error => {
  //       execToast(ToastStatus.ERROR, JSON.stringify(error));
  //       throw error;
  //     });
  // }

  function editEventHandler(): Promise<EventStruct> {
    const id_event = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('id') 
      : null;
  
    return axios.put<ApiResponse<EventStruct>>('/editEvent', {
      ...addEventData,
      gambar_url: eventImage,
      id_event: id_event,
    })
      .then(response => {
        if (response.data.status) {
          execToast(ToastStatus.SUCCESS, response.data.message);
        } else {
          execToast(ToastStatus.ERROR, response.data.message);
        }
        return response.data.data;
      })
      .catch(error => {
        execToast(ToastStatus.ERROR, JSON.stringify(error));
        throw error;
      });
  }
  

  // async function editEventHandler(): Promise<EventStruct> {
  //   try {
  //     const id_event = searchParams.get('id')
  //     const response = await axios.put<ApiResponse<EventStruct>>('/editEvent', {
  //       ...addEventData,
  //       gambar_url: eventImage,
  //       id_event: id_event,
  //     });
  
  //     if (response.data.status) {
  //       // const token = response.data.data.jwt_token;
  //       // const role = response.data.data.role;
  //       execToast(ToastStatus.SUCCESS, response.data.message)
  //     } else {
  //       execToast(ToastStatus.ERROR, response.data.message);
  //     }
  
  //     return response.data.data;
  //   } catch (error) {
  //     execToast(ToastStatus.ERROR, JSON.stringify(error));
  //     throw error;
  //   }
  // }

  // React.useEffect(() => {
  //   if(searchParams.get('id') && searchParams.get('id') !== "") {
  //       fetchSingleEventHandler()
  //   }
  // }, [])

  React.useEffect(() => {
    const id = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('id') 
      : null;
  
    if (id && id !== "") {
      fetchSingleEventHandler();
    }
  }, []);
  React.useEffect(() => {
    const addParam = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('add')
      : null;
  
    setIsAdd(addParam === "1");
  }, []);
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
                <Grid size={4}>
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
                                src={
                                    eventImage !== ""
                                        ? eventImage
                                        : PlaceholderImage
                                }
                                alt="Example"
                                // layout="responsive"
                                style={{
                                    objectFit: "cover"
                                }}
                                width={150}
                                height={150}
                            />
                            <Button 
                                variant='contained'
                                onClick={() => {
                                    const imageURL = prompt("Mohon masukkan URL Image :")
                                    if(imageURL) {
                                        setEventImage(imageURL as string)
                                    }
                                }}
                                sx={{
                                    marginTop: "5%",
                                    width: "50%"
                                }}
                            >
                                Add Picture
                            </Button>
                            <Button 
                                variant='contained'
                                color={'error'}
                                onClick={() => {
                                    setEventImage("")
                                }}
                                sx={{
                                    marginTop: ".75%",
                                    width: "50%"
                                }}
                            >
                                Delete Picture
                            </Button>
                            {/* <Typography variant="h6" component="h6" sx={{color: "black"}}>
                                Jual beli murah hanya di National Electronic
                            </Typography>
                            <Typography variant="overline" component="h6" sx={{color: "black"}}>
                                Gabung dan rasakan kemudahan bertransaksi di National Electronic
                            </Typography> */}
                        </Box>
                    </Item>
                </Grid>
                <Grid size={8}>
                    <Item>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'start',
                                alignItems: 'start',
                                height: '40vh',
                                // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                                paddingLeft: "2.5%",
                                paddingTop: "5%",
                                marginBottom: "10%",
                                marginTop: "10%",

                            }}
                        >
                            <TextField 
                                name="judul"
                                value={addEventData.judul} 
                                type="text" 
                                label="Nama Event" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange} 
                            />
                            <TextField 
                                name="deskripsi"
                                value={addEventData.deskripsi} 
                                type="text" 
                                label="Deskripsi Event" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange}
                                multiline
                                maxRows={3}
                            />
                            <Suspense fallback={<div>Loading...</div>}>

                            <Button 
                                variant="contained" 
                                onClick={
                                    isAdd
                                    ? addEventHandler
                                    : editEventHandler
                                }
                                sx={{
                                    marginTop: ".5%",
                                    width: 500,
                                }}>
                                {isAdd ? "Add" : "Edit"} Event
                            </Button>
                            
                            </Suspense>
                            <Button
                                color={"warning"}
                                variant="contained" 
                                onClick={() => router.push("/manageevent")}
                                sx={{
                                    marginTop: ".5%",
                                    width: 500,
                                }}>
                                Go Back
                            </Button>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
    <Footer />
      {/* <Suspense fallback={<div>Loading...</div>}><div>{param}</div>;</Suspense> */}
   </Box>
  );
}
// export const dynamic = "force-dynamic";
// export const dynamic = "force-no-static";
