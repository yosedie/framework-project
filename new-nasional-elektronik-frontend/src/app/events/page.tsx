"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, EventStruct, UserData, GetEventStruct, GetEventWithCommentStruct } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';


import React from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumIcon from '@mui/icons-material/Forum';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Avatar } from '@mui/material';

// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Accordion from '../component/AccordionDashboard'

// NEXT.JS
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import MainPage from './public/home_page.png'

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

const formatDateToGMT7 = (dateString: string): string => {
    const date = new Date(dateString);
    const gmt7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const formattedDate = gmt7Date.toISOString().slice(0, 10);
    const formattedTime = gmt7Date.toTimeString().slice(0, 8);
    return `${formattedDate} ${formattedTime}`;
};

export default function Events() {
    const [eventListComment, setEventListComment] = React.useState<GetEventWithCommentStruct>({
        event: {
            _id: "",
            deskripsi: "",
            judul: "",
            tanggal_ditambahkan: "",
        },
        comment: [],
    });
    const [eventList, setEventList] = React.useState<EventStruct[]>([]);
    const [eventListFiltered, setEventListFiltered] = React.useState<EventStruct[]>([]);
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [komentar, setKomentar] = React.useState<string>("");
      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
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
    const router = useRouter()
    const token = useSelector((state: RootState) => state.user.jwt_token)
    const role = useSelector((state: RootState) => state.user.role)
    const dispatch = useDispatch()

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

    async function getEventList(): Promise<GetEventStruct> {
        try {
            const response = await axios.get<ApiResponse<GetEventStruct>>(`/listEvent`, {
                params: {
                    user_token: token,
                }
            });
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

    async function toggleLikeHandler(id_event: string): Promise<GetEventStruct> {
        try {
            const response = await axios.post<ApiResponse<GetEventStruct>>(`/toggleLikeEvent`, {
                user_token: token,
                id_event: id_event,
            });
            if(response.data.status) {
                const updatedUserList = response.data.data.list.map((event: EventStruct) => ({
                    ...event,
                    tanggal_ditambahkan: formatDateToGMT7(event.tanggal_ditambahkan)
                }));
                
                setEventList(updatedUserList)
                setEventListFiltered(updatedUserList)
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

    async function fetchEventWithComment(eventID: string): Promise<GetEventWithCommentStruct> {
        try {
            const response = await axios.get<ApiResponse<GetEventWithCommentStruct>>(`/fetchEventUser`, {
                params: {
                    eventID,
                }
            });
            if(response.data.status) {
                setEventListComment({...response.data.data})
            } else {
                execToast(ToastStatus.ERROR, response.data.message)
            }
            return response.data.data;
        } catch (error) {
            execToast(ToastStatus.ERROR, JSON.stringify(error))
            throw error;
        }
    }

    async function postCommentHandler(id_event: string): Promise<GetEventWithCommentStruct> {
        try {
          const response = await axios.post<ApiResponse<GetEventWithCommentStruct>>('/addCommentEvent', {
            user_token: token,
            id_event,
            comment: komentar,
          });
      
          if (response.data.status) {
            setEventListComment({...response.data.data})
            execToast(ToastStatus.SUCCESS, response.data.message);
            setKomentar("")
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
        getEventList()
    }, [])

    return (
        <Box sx={{backgroundColor: "white"}}>
            <Modal
                open={open}
                onClose={() => {
                    handleClose()
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginTop: "1.25%"}}>
                            Komentar Event
                        </Typography>
                        <Typography 
                            id="modal-modal-description" 
                            sx={{ 
                            mt: 2, 
                            display: "flex", 
                            alignItems: "center",
                            gap: 1,
                            }}
                        >
                            <TextField 
                                name="deskripsi"
                                value={komentar} 
                                type="text" 
                                label="Komentar Anda" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKomentar(e.target.value)}
                                multiline
                                maxRows={3}
                            />
                        </Typography>
                        <Button 
                            variant='contained'
                            onClick={() => {
                                postCommentHandler(eventListComment.event._id as string)
                            }}
                        >
                            Kirim komentar
                        </Button>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginTop: "1.25%"}}>
                            Daftar Komentar event
                        </Typography>
                        {
                            eventListComment.comment.map(comment => {
                            return (
                            <Box sx={{margin: "1.25%", padding: "1.25%", border: "1px solid black"}}>
                                <Box 
                                sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: 1,
                                }}
                                >
                                    <Avatar src={comment.user.picture_profile || ""} />
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                        <Typography 
                                        id="modal-modal-title" 
                                        variant="h6" 
                                        component="h2" 
                                        sx={{ margin: 0, fontSize: 14 }}
                                        >
                                        {comment.user.nama}
                                        </Typography>
                                        {/* <Rating value={parseInt(comment.rating)} readOnly /> */}
                                    </Box>
                                </Box>
                                <Typography id="modal-modal-description" sx={{fontSize: 14, mt: 1, whiteSpace: "pre-line"}}>
                                {comment.comment}
                                </Typography>
                            </Box>
                            )
                            })
                        }
                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Product : 
                        </Typography>
                        {
                            transactionDetailList.map(data => {
                                return (
                                    <Box sx={{border: "1px solid black", padding: "2.5%", marginTop: "2.5%"}}>
                                        <Image
                                            draggable={false}
                                            src={data.product.gambar_url as string}
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
                        } */}
                    </Box>
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
            <Typography variant='h5' textAlign={"left"} color='black' margin={3}>
                Events
            </Typography>
            <TextField 
                value={searchValue}
                id="outlined-basic" 
                label="Search Event" 
                variant="outlined" 
                sx={{width: "96.9%", ml: 3}}
                fullWidth 
                onChange={handleSearchChange}
            />
            {
                eventListFiltered.length === 0 && (
                    <Box>
                        <Typography variant="h5" color='black' textAlign={"center"} sx={{
                            margin: "12% 0"
                        }}>
                            Data / Pencarian Event kosong !
                        </Typography>
                    </Box>
                )
            }
            <Grid container>
                {
                    eventListFiltered.map(data => {
                        return (
                        <Grid size={6}>
                            <Item>
                                <Card sx={{ maxWidth: "100%" }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={data.gambar_url}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" textAlign={"left"}>
                                            {data.judul}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify" }}>
                                            {data.tanggal_ditambahkan}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify", marginTop: "2.5%" }}>
                                            {data.deskripsi}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Box sx={{ ml: 'auto' }}>
                                            {data.likeCount}
                                        <IconButton aria-label="add to favorites" onClick={() => {
                                            if(role && role.length > 0) {
                                                if(role === "user") {
                                                    toggleLikeHandler(data._id as string)
                                                }
                                            } else {
                                                router.push("/login")
                                            }
                                        }}>
                                            <FavoriteIcon sx={{color: data.liked ? "red" : ""}} />
                                        </IconButton>
                                        <IconButton aria-label="more options" onClick={() => {
                                            if(role && role.length > 0) {
                                                if(role === "user") {
                                                    handleOpen()
                                                    fetchEventWithComment(data._id as string)
                                                }
                                            } else {
                                                router.push("/login")
                                            }
                                        }}>
                                            <ForumIcon />
                                        </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Item>
                        </Grid>
                        )
                    })
                }
            </Grid>
        <Footer />
        </Box>
    );
}