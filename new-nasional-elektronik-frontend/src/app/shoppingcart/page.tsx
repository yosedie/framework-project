"use client"

import axios from '../util/axios/axios';
import { LoginData, ApiResponse, MidtransTokenData, SnapPaymentResult} from '../types/types';
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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Spacer from '@mui/material/Spacer';


// CSS
import styles from './page.module.css'

// REDUX
import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { UserState, login, removeFromCart, removeAllFromCart, removeQuantityFromCart, addToCart } from '../util/redux/Features/user/userSlice';
import { increment, decrement, incrementByAmount } from '../util/redux/Features/counter/counterSlice';
import { ProductStruct } from '../types/types';

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

export interface CartProduct extends ProductStruct {
    quantity: number;
}


export default function Login() {
  const router = useRouter()
  const address = useSelector((state: RootState) => state.user.userData.alamat)
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const shoppingCart = useSelector((state: RootState) => state.user.shopping_cart)
  const dispatch = useDispatch()

  const [addressValid, setAddressValid] = React.useState<boolean>(false)
  const [snapToken, setSnapToken] = React.useState<String>("")
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
 });

 const groupedCart = shoppingCart.reduce((acc: CartProduct[], item: ProductStruct) => {
    const found = acc.find((product) => product.id_produk === item.id_produk);
    if (found) {
        found.quantity += 1;
    } else {
        acc.push({ ...item, quantity: 1 });
    }
    return acc;
 }, [] as CartProduct[]);

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

  React.useEffect(() => {
    sessionStorage.removeItem('payment_info')
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; 
    script.setAttribute('data-client-key', 'SB-Mid-client-t9vamsHp5lVGoR8Z');
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (snap_token: string) => {
    if ((window as any).snap) {
      (window as any).snap.embed(snap_token, {
        embedId: 'snap-container',
        onSuccess: function (result: SnapPaymentResult) {
            sessionStorage.setItem('payment_info', JSON.stringify({
                ...result,
                alamat: address,
                stok: 15,
            }));
            // const paymentData = "20 Desember 2024";
            // dispatch(setPaymentInfo(paymentData));
            // router.push('/sucesstransaction');
        },
        onPending: function (result: SnapPaymentResult) {
            sessionStorage.setItem('payment_info', JSON.stringify({
                transaction_time: (new Date()).toISOString().slice(0, 10),
                gross_amount: 12000,
                alamat: "PENDING",
                stok: 15,
                transaction_status: "pending"
            }));
            console.log('Payment Pending:', result);
        },
        onError: function (result: SnapPaymentResult) {
            console.log('Payment Error:', result);
        },
        onClose: function () {
            console.log('Payment popup closed');
        },
      });
    } else {
      console.log('Snap is not loaded yet');
    }
  };

  const handlePaymentDispatch = async () => {
    try {
        router.push('/successTransaction');
    } catch (error) {
        execToast(ToastStatus.ERROR, "Terjadi kesalahan saat menyimpan data pembayaran");
    }
};


 async function loginHandler(): Promise<LoginData> {
    try {
        const response = await axios.post<ApiResponse<LoginData>>(`/login`, {
            ...loginData
        });
        if(response.data.status) {
            dispatch(login(response.data.data.jwt_token))
            execToast(ToastStatus.SUCCESS, response.data.message)
            router.push("/products")
        } else {
            execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
 }

 async function checkConfirmationAddress(user_token: string, status_filter: number): Promise<boolean> {
    try {
        const response = await axios.get<ApiResponse<boolean>>(`/checkConfirmationAddress`, {
          params: {
            user_token,
            status_filter
          }
        });
        if(response.data.status) {
          setAddressValid(response.data.data)
        } else {
          execToast(ToastStatus.ERROR, response.data.message)
        }
        return response.data.data;
    } catch (error) {
        execToast(ToastStatus.ERROR, JSON.stringify(error))
        throw error;
    }
  }

 async function midtransSnapHandler(): Promise<MidtransTokenData> {
    try {
        const grand_total_cart = shoppingCart.reduce((total, product) => total + product.harga, 0)
        const response = await axios.post<ApiResponse<MidtransTokenData>>(`/getPaymentToken`, {
            id_pelanggan: token,
            total_harga: grand_total_cart,
            alamat_pengiriman: address,
            item: JSON.stringify([...shoppingCart]),
        });
        if(response.data.status) {
            setSnapToken(response.data.data.token)
            await handlePayment(response.data.data.token)
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
    checkConfirmationAddress(token, 1)
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
        <Box sx={{margin: "1.5% 2.5%"}}>
            <Typography variant="h5" color='black'>
                Shopping Cart
            </Typography>
            {
                shoppingCart.length === 0 && (
                    <Typography variant="h6" color='black' textAlign={"center"}>
                        Cart masih kosong, silahkan <Link href="#" onClick={() => handleRoute("products")}>
                            berbelanja
                        </Link> terlebih dahulu !
                    </Typography>
                )
            }
            {
                groupedCart.map((data, index) => (
                    <Card 
                        quantity={data.quantity}
                        key={`${data.id_produk}_${index}`}
                        title={data.nama_produk}
                        description={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.harga * data.quantity)}
                        image_url={data.gambar_url}
                        isActionDelete
                        isDescriptionTitle
                        isHorizontal
                        fullWidth
                        withImage
                        onClickCard={handlePaymentDispatch}
                        onClickSecondaryCard={() => dispatch(removeFromCart(data.id_produk as string))}
                        onClickAddQuantity={() => dispatch(addToCart(data as ProductStruct))}
                        onClickRemoveQuantity={() => dispatch(removeQuantityFromCart(data.id_produk as string))}
                    />
                ))
            }
            <Card 
                title={`Total Purchased Item : ${shoppingCart.length}`}
                description={`Grand Total: Rp. ${new Intl.NumberFormat().format(shoppingCart.reduce((total, product) => total + product.harga, 0))}`}
                isDescriptionTitle={true}
                isHorizontal={true}
                fullWidth={true}
                withImage={false}
                marginTopParam='40vh'
                onClickCard={() => {
                    if(shoppingCart.length === 0) {
                        execToast(ToastStatus.WARNING, "Harap tambahkan produk, minimal 1 !")
                        router.push("/products")
                    } else if(!addressValid) {
                        execToast(ToastStatus.WARNING, "Harap mengajukkan konfirmasi alamat pengiriman !")
                        router.push("/profile")
                    } else {
                        midtransSnapHandler()
                    }
                }}
                onClickSecondaryCard={() => dispatch(removeAllFromCart({}))}
            />
            {
                snapToken !== "" && (
                    <Typography variant='overline' color='black' style={{
                        zIndex: "1000",
                        position: "absolute", 
                        top: "18%", 
                        left: "65%",
                        color: "white",
                        fontSize: "16px",
                    }}>
                        <span style={{cursor: "pointer"}} onClick={() => {
                            if ((window as any).snap) {
                                (window as any).snap.hide();
                                setSnapToken("")
                            }
                        }}>
                            X
                        </span>
                    </Typography>
                )
            }
            <div 
                id="snap-container" 
                style={{ 
                    height: '500px', 
                    width: '500px', 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)"
                }}>
            </div>
        </Box>
    <Footer />
   </Box>
  );
}