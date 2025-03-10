/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from './util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './util/redux/Features/counter/counterSlice';

// COMPONENT
import AppBar from './component/AppBar'
import StepperHome from './component/StepperHome'
import StepperHome2 from './component/StepperHome2'
import Footer from './component/Footer'

// NEXT.JS
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import MainPage from './public/home_page.png'

type User = {
  email: string;
  jwt_token: string;
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null); // Reset user state
    router.push('/login');
  };

  return (
   <>
    <AppBar />
    {/* {user ? (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Selamat Datang, {user.email}</Typography>
          <button onClick={handleLogout}>Logout</button>
        </Box>
      ) : (
        <Typography variant="h6">Silakan login untuk melanjutkan</Typography>
      )} */}
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
      >Increment by 2</button> */}
      {/* <button onClick={() => router.push("/admin")}>
        to Admin
      </button> */}
      <Image
        draggable={false}
        src={MainPage}
        alt="Example"
        layout="responsive"
        width={0}
        height={200}
      />
      <StepperHome />
      <StepperHome2 />
      <Typography variant='h5' sx={{ mt: 2, mb: 1, py: 1 }} textAlign={"center"}>
        Dimana toko <span style={{fontWeight: "bold"}}>New Nasional ?</span>
      </Typography>
      <Box 
        sx={{ 
          width: '75%',
          margin: "0 auto"
        }}
      >
          <iframe 
              width="100%" 
              height="600"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=-7.639432531767529, 112.90723166818091+(Toko%20Nasional%20Elektronik)&amp;t=&amp;z=20&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
          </iframe>
      </Box>
      <Footer />
   </>
  );
}