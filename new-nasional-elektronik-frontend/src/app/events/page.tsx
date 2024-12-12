"use client"

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
import type { RootState } from '../util/redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';

// COMPONENT
import AppBar from '../component/AppBar'
import Footer from '../component/Footer'
import Card from '../component/CardEvents'
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

export default function Events() {
  const router = useRouter()
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

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
        <Typography variant='h5' textAlign={"left"} color='black' margin={3}>
            Events
        </Typography>
        <Grid container>
            <Grid size={6}>
                <Item>
                    <Card />
                </Item>
            </Grid>
            <Grid size={6}>
                <Item>
                    <Card />
                </Item>
            </Grid>
        </Grid>
    <Footer />
   </Box>
  );
}