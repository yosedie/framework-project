"use client"

import axios from '../util/axios/axios';
import { AddData, ApiResponse } from '../types/types';
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

const productsName = ["Test", "Test2"]

export default function AddProduct() {
  const searchParams = useSearchParams()
  const isAdd : boolean = searchParams.get('add') === "1"

  const router = useRouter()
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  const [addData, setAddData] = React.useState({
    nama_produk: "",
    harga: 0,
    status: 1,
    kategori_id: -1,
    stok: 0,
    deskripsi: "",
 });
 const handleRoute = (paramPage: String) => {
    router.push(`/${paramPage}`)
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddData(prevData => ({
      ...prevData,
      [name]: value,
    }));
 };
 const handleChangeDropdown = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setAddData(prevData => ({
      ...prevData,
      [name]: value,
    }));
 };

 async function addProductHandler(): Promise<AddData> {
    try {
      const response = await axios.post<ApiResponse<AddData>>('/login', addData);
  
      if (response.data.status) {
        // const token = response.data.data.jwt_token;
        // const role = response.data.data.role;
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }  

  async function editProductHandler(): Promise<AddData> {
    try {
      const response = await axios.post<ApiResponse<AddData>>('/login', addData);
  
      if (response.data.status) {
        // const token = response.data.data.jwt_token;
        // const role = response.data.data.role;
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
                                src={PlaceholderImage}
                                alt="Example"
                                // layout="responsive"
                                width={150}
                                height={150}
                            />
                            <Button 
                                variant='contained'
                                onClick={() => {
                                    router.push(`/addproduct`)
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
                                    router.push(`/addproduct`)
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
                                height: '60vh',
                                // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                borderRadius: '4px',
                                paddingLeft: "2.5%",
                                paddingTop: "5%",
                                marginBottom: isAdd ? "10%" : "15%",
                            }}
                        >
                            <TextField 
                                name="nama_produk"
                                value={addData.nama_produk} 
                                type="text" 
                                label="Nama Produk" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange} 
                            />
                            <TextField 
                                name="harga"
                                value={addData.harga} 
                                type="number" 
                                label="Harga Barang" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange} 
                            />
                            <FormControl sx={{
                                width: 500,
                                marginBottom: "1.25%"
                            }}>
                                <InputLabel>
                                    Kategori Produk
                                </InputLabel>
                                <Select
                                name='kategori_id'
                                value={addData.kategori_id}
                                label="Kategori Produk"
                                onChange={handleChangeDropdown}
                                sx={{
                                    width: 500,
                                }}
                                >
                                    <MenuItem value={0}>
                                        Kulkas
                                    </MenuItem>
                                    <MenuItem value={1}>
                                        AC
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        Mesin Cuci
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <TextField 
                                name="stok"
                                value={addData.stok} 
                                type="number" 
                                label="Stok Barang" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange} 
                            />
                            <TextField 
                                name="deskripsi"
                                value={addData.deskripsi} 
                                type="text" 
                                label="Deskripsi Produk" 
                                variant="outlined" 
                                sx={{ marginBottom: "1.25%", width: 500 }} 
                                onChange={handleChange}
                                multiline
                                maxRows={3}
                            />
                            {
                                !isAdd && (
                                    <FormControl sx={{
                                        width: 500,
                                        marginBottom: "1.25%"
                                    }}>
                                        <InputLabel>
                                            Status Produk
                                        </InputLabel>
                                        <Select
                                        name='status'
                                        value={addData.status}
                                        label="Status Produk"
                                        onChange={handleChangeDropdown}
                                        sx={{
                                            width: 500,
                                        }}
                                        >
                                            <MenuItem value={1}>
                                                Aktif
                                            </MenuItem>
                                            <MenuItem value={0}>
                                                Pasif
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )
                            }
                            <Button 
                                variant="contained" 
                                onClick={
                                    isAdd
                                    ? addProductHandler
                                    : editProductHandler
                                }
                                sx={{
                                    marginTop: ".5%",
                                    width: 500,
                                }}>
                                {isAdd ? "Add" : "Edit"} Product
                            </Button>
                            <Button
                                color={"warning"}
                                variant="contained" 
                                onClick={() => router.push("/products")}
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
   </Box>
  );
}