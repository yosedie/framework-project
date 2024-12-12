"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, ProductStruct } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';
import { addToCart, login } from '../util/redux/Features/user/userSlice';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Card from '../component/Card'
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

export default function Products() {
  const router = useRouter()
//   const count = useSelector((state: RootState) => state.counter.value)
  const products = [
    {
        "id_produk": "1",
        "nama_produk": "test produk",
        "kategori": "test kategori",
        "harga": 10000.00,
        "stok": 10,
        "deskripsi": "test deskripsi",
        "tanggal_ditambahkan": new Date("2024-12-17"),
        "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
        "status": "aktif",
    },
    {
        "id_produk": "2",
        "nama_produk": "test produk 2",
        "kategori": "test kategori",
        "harga": 10000.00,
        "stok": 10,
        "deskripsi": "test deskripsi",
        "tanggal_ditambahkan": new Date("2024-12-06"),
        "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
        "status": "aktif",
    },
    {
        "id_produk": "3",
        "nama_produk": "test produk 3",
        "kategori": "test kategori",
        "harga": 10000.00,
        "stok": 10,
        "deskripsi": "test deskripsi",
        "tanggal_ditambahkan": new Date("2024-12-02"),
        "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
        "status": "aktif",
    },
  ]
  const account = useSelector((state: RootState) => state.user.jwt_token)
  const dispatch = useDispatch()

  const handleAddToCart = (data: ProductStruct): void => {
    if(account !== "") {
        dispatch(addToCart(data))
        execToast(ToastStatus.SUCCESS, `Sukses menambahkan item ${data.nama_produk} ke cart`)
    } else {
        router.push("/login")
    }
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
        <Grid container>
            <Grid size={3}>
                <Item>
                    <Typography variant='body1' textAlign={"left"}>
                        Dashboard Pengaturan
                    </Typography>
                    <Autocomplete
                        disablePortal
                        options={productsName}
                        sx={{ width: "100%", marginTop: "5%" }}
                        renderInput={(params) => <TextField {...params} label="Products name" />}
                    />
                    <Accordion />
                </Item>
            </Grid>
            <Grid container size={9}>
                {
                    products.map((data, index) => {
                        return (
                            <Grid size={3}>
                                <Item>
                                    <Card
                                        key={`${data.id_produk}_${index}`}
                                        title={data.nama_produk}
                                        description={data.deskripsi}
                                        image_url={data.gambar_url}
                                        withImage
                                        onClickCard={() => handleAddToCart(data)} 
                                    />
                                </Item>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Grid>
    <Footer />
   </Box>
  );
}