/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, EventStruct, UserData, GetEventStruct, FetchTransactionStruct } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
// import Spacer from '@mui/material/Spacer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

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

export interface CartProduct extends ProductStruct {
    quantity: number;
}


export default function ManageEvent() {
  const [detail, setDetail] = React.useState<EventStruct>({
    judul: "",
    deskripsi: "",
    tanggal_ditambahkan: "",
  });
  const [detailID, setDetailID] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()
  const account = useSelector((state: RootState) => state.user.jwt_token)
  const shoppingCart = useSelector((state: RootState) => state.user.shopping_cart)
  const dispatch = useDispatch()

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });
  const [eventList, setEventList] = React.useState<EventStruct[]>([]);
  const [eventListFiltered, setEventListFiltered] = React.useState<EventStruct[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [eventDetail, setEventDetail] = React.useState<EventStruct>({
    _id: "",
    judul: "",
    deskripsi: "",
    gambar_url: "",
    tanggal_ditambahkan: "",
  });


 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSearchValue(value)
    if(value.length === 0) {
        setEventListFiltered([...eventList])
    } else {
        const eventFiltered = [...eventList].filter((item) =>
            item.judul.toLowerCase().includes(value.toLowerCase()) ||
            item.deskripsi.toLowerCase().includes(value.toLowerCase())
        );
        setEventListFiltered([...eventFiltered])
    }
 };

 const capitalizeFirstChar = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

 const formatDateToGMT7 = (dateString: string): string => {
    const date = new Date(dateString);
    const gmt7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const formattedDate = gmt7Date.toISOString().slice(0, 10);
    const formattedTime = gmt7Date.toTimeString().slice(0, 8);
    return `${formattedDate} ${formattedTime}`;
 };

 async function getEventList(): Promise<GetEventStruct> {
    try {
        const response = await axios.get<ApiResponse<GetEventStruct>>(`/listEvent`);
        if(response.data.status) {
            const updatedUserList = response.data.data.list.map((event: EventStruct) => ({
                ...event,
                tanggal_ditambahkan: formatDateToGMT7(event.tanggal_ditambahkan)
            }));
            
            setEventList(updatedUserList)
            setEventListFiltered(updatedUserList)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function editEvent(id_event: string): Promise<GetEventStruct> {
    try {
        const response = await axios.put<ApiResponse<GetEventStruct>>(`/editEvent`, {
            id_event: id_event,
            judul: eventDetail.judul,
            deskripsi: eventDetail.deskripsi,
            gambar_url: eventDetail.gambar_url
        });
        if(response.data.status) {
            const updatedEventList = response.data.data.list.map((event: EventStruct) => ({
                ...event,
                tanggal_daftar: formatDateToGMT7(event.tanggal_ditambahkan)
            }));
            
            setEventList(updatedEventList);
            setEventListFiltered(updatedEventList);
            execToast(ToastStatus.SUCCESS, response.data.message)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        alert(error)
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function deleteEvent(id_event: string): Promise<GetEventStruct> {
    try {
        const response = await axios.delete<ApiResponse<GetEventStruct>>(`/deleteEvent`, {
            data: {
                id_event
            }
        });
        if(response.data.status) {
            const updatedEventList = response.data.data.list.map((event: EventStruct) => ({
                ...event,
                tanggal_ditambahkan: formatDateToGMT7(event.tanggal_ditambahkan)
            }));
            setEventList(updatedEventList);
            setEventListFiltered(updatedEventList);
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

 const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEventDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDropdownChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setEventDetail((prev) => ({
      ...prev,
      role: value as string,
    }));
  };

 React.useEffect(() => {
    getEventList()
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
                        Event Edit
                    </Typography>
                    <Image
                        draggable={false}
                        src={
                            eventDetail.gambar_url as string
                        }
                        alt="Example"
                        layout="responsive"
                        width={0}
                        height={200}
                    />
                    <TextField 
                        name="judul"
                        label="Judul Event"
                        type='text'
                        variant="outlined"
                        sx={{marginTop: "1.5%"}}
                        fullWidth
                        value={eventDetail.judul}
                        onChange={handleInputChange}
                    />
                    <TextField 
                        name="deskripsi"
                        type="text" 
                        label="Deskripsi Event" 
                        variant="outlined" 
                        sx={{ marginTop: "1.5%" }} 
                        fullWidth
                        multiline
                        maxRows={3}
                        onChange={handleInputChange}
                        value={eventDetail.deskripsi} 
                    />
                    <br /> <Button
                        sx={{
                            marginTop: "1.5%",
                            display: "block",
                            borderRadius: 0,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            editEvent(detail._id as string)
                        }}
                    >
                        Edit Event
                    </Button>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Event Sejak : {detail.tanggal_ditambahkan}
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
                Manage Event
            </Typography>
            <Button 
                variant='contained'
                onClick={() => {
                    router.push(`/editevent?add=1`)
                }}
                sx={{
                    marginTop: "1.5%"
                }}
            >
                + Add Event
            </Button>
            <TextField 
                value={searchValue}
                id="outlined-basic" 
                label="Search Event" 
                variant="outlined" 
                sx={{marginTop: "2.5%"}}
                fullWidth 
                onChange={handleSearchChange}
            />
            {
                eventListFiltered.length === 0 && (
                    <Box>
                        <Typography variant="h5" color='black' textAlign={"center"} sx={{
                            margin: "10% 0"
                        }}>
                            Data / Pencarian Event kosong !
                        </Typography>
                    </Box>
                )
            }
            {
                eventListFiltered.map((data, index) => {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', marginTop: "1.5%" }}>
                            <Card sx={{ flexGrow: 1, minWidth: 275 }}>
                                <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    Event Sejak : {data.tanggal_ditambahkan}
                                </Typography>
                                <Image
                                    draggable={false}
                                    src={
                                        data.gambar_url as string
                                    }
                                    alt="Example"
                                    width={700}
                                    height={300}
                                    style={{
                                        objectFit: "cover"
                                    }}
                                />
                                <Typography variant="h4" component="div">
                                    {data.judul}
                                </Typography>
                                <Typography variant="body1">
                                    {data.deskripsi}
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
                                color="warning"
                                onClick={() => {
                                    handleOpen()
                                    setDetailID(data._id as string)
                                    setDetail({...data})
                                    setEventDetail(prevState => ({
                                        ...prevState,
                                        _id: data._id,
                                        judul: data.judul,
                                        deskripsi: data.deskripsi,
                                        gambar_url: data.gambar_url,
                                        tanggal_ditambahkan: data.tanggal_ditambahkan,
                                    }))
                                }}
                                >
                                    Edit Event
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteEvent(data._id as string)}
                                >
                                    Delete Event
                                </Button>
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