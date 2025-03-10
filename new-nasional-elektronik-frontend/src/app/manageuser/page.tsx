/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, GetTransactionStruct, UserData, GetUserStruct, FetchTransactionStruct } from '../types/types';
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

const productsName = ["Test", "Test2"]

export interface CartProduct extends ProductStruct {
    quantity: number;
}


export default function ManageUser() {
  const [detail, setDetail] = React.useState<UserData>({
    _id: "",
    nama: "",
    email: "",
    password: "",
    role: "",
    tanggal_daftar: "",
    telepon: "",
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
  const [userList, setUserList] = React.useState<UserData[]>([]);
  const [userListFiltered, setUserListFiltered] = React.useState<UserData[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [userDetail, setUserDetail] = React.useState<UserData>({
    _id: "",
    role: "",
    nama: "",
    email: "",
    telepon: "",
    password: "",
    tanggal_daftar: "",
  });


 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSearchValue(value)
    if(value.length === 0) {
        setUserListFiltered([...userList])
    } else {
        const userFiltered = [...userList].filter((item) =>
            item.nama.toLowerCase().includes(value.toLowerCase()) ||
            item.email.toLowerCase().includes(value.toLowerCase()) ||
            item.telepon.toLowerCase().includes(value.toLowerCase())
        );
        setUserListFiltered([...userFiltered])
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

 async function getUserList(): Promise<GetUserStruct> {
    try {
        const response = await axios.get<ApiResponse<GetUserStruct>>(`/listUser`);
        if(response.data.status) {
            const updatedUserList = response.data.data.list.map((user: UserData) => ({
                ...user,
                tanggal_daftar: formatDateToGMT7(user.tanggal_daftar),
                password: "",
            }));
            
            setUserList(updatedUserList)
            setUserListFiltered(updatedUserList)
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function editUser(id_user: string): Promise<GetUserStruct> {
    try {
        const response = await axios.put<ApiResponse<GetUserStruct>>(`/editUser`, {
            id_user: id_user,
            role: userDetail.role,
            nama: userDetail.nama,
            email: userDetail.email,
            telepon: userDetail.telepon,
            password: userDetail.password,
        });
        if(response.data.status) {
            const updatedUserList = response.data.data.list.map((user: UserData) => ({
                ...user,
                tanggal_daftar: formatDateToGMT7(user.tanggal_daftar),
                password: "",
            }));
            
            setUserList(updatedUserList);
            setUserListFiltered(updatedUserList);
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

 async function deleteUser(id_user: string): Promise<GetUserStruct> {
    try {
        const response = await axios.delete<ApiResponse<GetUserStruct>>(`/deleteUser`, {
            data: {
                id_user
            }
        });
        if(response.data.status) {
            const updatedUserList = response.data.data.list.map((user: UserData) => ({
                ...user,
                tanggal_daftar: formatDateToGMT7(user.tanggal_daftar),
                password: "",
            }));
            
            setUserList(updatedUserList);
            setUserListFiltered(updatedUserList);
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
    setUserDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDropdownChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setUserDetail((prev) => ({
      ...prev,
      role: value as string,
    }));
  };

 React.useEffect(() => {
    getUserList()
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
                        User Edit
                    </Typography>
                    <FormControl fullWidth sx={{marginTop: "3.5%"}}>
                        <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                        <Select
                            name="role"
                            value={userDetail.role}
                            label="User Role"
                            onChange={handleDropdownChange}
                        >
                        <MenuItem value={"user"}>User</MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"penjual"}>Penjual</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        name="email"
                        label="Email"
                        type='email'
                        variant="outlined"
                        sx={{marginTop: "1.5%"}}
                        fullWidth
                        value={userDetail.email}
                        onChange={handleInputChange}
                    />
                    <TextField 
                        name="nama"
                        label="Nama"
                        type='text'
                        variant="outlined"
                        sx={{marginTop: "1.5%"}}
                        fullWidth
                        value={userDetail.nama}
                        onChange={handleInputChange}
                    />
                    <TextField 
                        name="telepon"
                        label="Telepon"
                        type='tel'
                        variant="outlined"
                        sx={{marginTop: "1.5%"}}
                        fullWidth
                        value={userDetail.telepon}
                        onChange={handleInputChange}
                    />
                    <TextField 
                        name="password"
                        label="New Password"
                        type='password'
                        variant="outlined"
                        sx={{marginTop: "1.5%"}}
                        fullWidth
                        value={userDetail.password}
                        onChange={handleInputChange}
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
                            editUser(detail._id)
                        }}
                    >
                        Edit User
                    </Button>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Daftar Sejak : {detail.tanggal_daftar}
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
                Manage User
            </Typography>
            <TextField 
                value={searchValue}
                id="outlined-basic" 
                label="Search User" 
                variant="outlined" 
                sx={{marginTop: "2.5%"}}
                fullWidth 
                onChange={handleSearchChange}
            />
            {
                userListFiltered.length === 0 && (
                    <Box>
                        <Typography variant="h5" color='black' textAlign={"center"} sx={{
                            margin: "12% 0"
                        }}>
                            Data / Pencarian User kosong !
                        </Typography>
                    </Box>
                )
            }
            {
                userListFiltered.map((data, index) => {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', marginTop: "1.5%" }}>
                            <Card sx={{ flexGrow: 1, minWidth: 275 }}>
                                <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    Daftar Sejak : {data.tanggal_daftar}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    Email : {data.email}
                                </Typography>
                                <Typography variant="body1">
                                    Role : <strong>{capitalizeFirstChar(data.role)}</strong> <br />
                                    Nama : {data.nama} <br />
                                    Telepon : +{data.telepon}
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
                                    setDetail({...data})
                                    setDetailID(data._id)
                                    setUserDetail(prevState => ({
                                        ...prevState,
                                        _id: data._id,
                                        role: data.role,
                                        nama: data.nama,
                                        email: data.email,
                                        telepon: data.telepon
                                    }))
                                }}
                                >
                                Edit User
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1,
                                        borderRadius: 0,
                                    }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteUser(data._id)}
                                >
                                Delete User
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