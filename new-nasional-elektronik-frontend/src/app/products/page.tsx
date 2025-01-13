"use client"

import axios from '../util/axios/axios';
import { SortConfig, ApiResponse, ProductStruct, GetProductStruct, Kategori, KategoriData, RatingStruct, ListRating } from '../types/types';
import { execToast, ToastStatus } from '../util/toastify/toast';

import React, { useState } from 'react';

import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import { Avatar } from '@mui/material';

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
import zIndex from '@mui/material/styles/zIndex';

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
  const [comments, setComments] = useState<ListRating[]>([]);
  const [products, setProducts] = useState<ProductStruct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductStruct[]>([]);
//   const [products, setProducts] = useState([
    // {
    //     "id_produk": "1",
    //     "nama_produk": "test produk",
    //     "kategori": "test kategori",
    //     "harga": 10000.00,
    //     "stok": 10,
    //     "deskripsi": "test deskripsi",
    //     "tanggal_ditambahkan": new Date("2024-12-17"),
    //     "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
    //     "status": "aktif",
    // },
    // {
    //     "id_produk": "2",
    //     "nama_produk": "test produk 2",
    //     "kategori": "test kategori",
    //     "harga": 10000.00,
    //     "stok": 10,
    //     "deskripsi": "test deskripsi",
    //     "tanggal_ditambahkan": new Date("2024-12-06"),
    //     "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
    //     "status": "aktif",
    // },
    // {
    //     "id_produk": "3",
    //     "nama_produk": "test produk 3",
    //     "kategori": "test kategori",
    //     "harga": 10000.00,
    //     "stok": 10,
    //     "deskripsi": "test deskripsi",
    //     "tanggal_ditambahkan": new Date("2024-12-02"),
    //     "gambar_url": "https://media.istockphoto.com/id/182717773/nl/foto/ak-47.jpg?s=1024x1024&w=is&k=20&c=l4byp2mNhjq8yHY8JZbxWVuMiD-ntHt71fR8gqhFyjc=",
    //     "status": "aktif",
    // },
 //  ])
  const token = useSelector((state: RootState) => state.user.jwt_token)
  const role = useSelector((state: RootState) => state.user.role)
  const dispatch = useDispatch()

  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    order: "",
    orderBy: "",
  });
  const [search, setSearch] = React.useState<string>("");
  const [komentar, setKomentar] = React.useState<string>("");
  const [starValue, setStarValue] = React.useState<number | null>(null);
  const [detailProduct, setDetailProduct] = React.useState<ProductStruct>({
    nama_produk: "",
    deskripsi: "",
    harga: -1,
    stok: -1,
    kategori_id: -1,
    status: -1,
  });
  const [detailID, setDetailID] = React.useState<string>("");
  const [ratingFilter, setRatingFilter] = React.useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<Kategori[]>([]);
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

  const handleSearchChange = (value: string) => {
    const searchValue = value;
    setSearch(searchValue);

    if (searchValue === "") {
        setFilteredProducts(products);
    } else {
        const filtered = products.filter((product) =>
            product.nama_produk.toLowerCase().startsWith(searchValue.toLowerCase())
        );
        setFilteredProducts(filtered);
    }
};

  async function deleteProductHandler(id_produk: string): Promise<GetProductStruct> {
    try {
      const response = await axios.delete<ApiResponse<GetProductStruct>>('/deleteProduct', {
        data: {
            id_produk: id_produk
        }
      });
  
      if (response.data.status) {
        execToast(ToastStatus.SUCCESS, response.data.message);
        setProducts(response.data.data.list)
        setFilteredProducts(response.data.data.list)
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }

  async function listCommentHandler(id_product: string): Promise<RatingStruct> {
    try {
      const response = await axios.get<ApiResponse<RatingStruct>>('/fetchComment', {
        params: {
          id_product
        }
      });
  
      if (response.data.status) {
        setComments(response.data.data.list)
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }

  async function postCommentHandler(jwt_token: string, id_product: string): Promise<RatingStruct> {
    try {
      const response = await axios.post<ApiResponse<RatingStruct>>('/postComment', {
        jwt_token: jwt_token,
        id_product: id_product,
        rating: starValue,
        komentar: komentar,
      });
  
      if (response.data.status) {
        setComments(response.data.data.list)
        execToast(ToastStatus.SUCCESS, response.data.message);
        setKomentar("")
        setStarValue(null)
        listProductHandler()
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }

  async function listProductHandler(): Promise<GetProductStruct> {
    try {
      const response = await axios.get<ApiResponse<GetProductStruct>>('/listProduct');
  
      if (response.data.status) {
        setProducts(response.data.data.list)
        setFilteredProducts(response.data.data.list)
      } else {
        execToast(ToastStatus.ERROR, response.data.message);
      }
  
      return response.data.data;
    } catch (error) {
      execToast(ToastStatus.ERROR, JSON.stringify(error));
      throw error;
    }
  }

  const handleAddToCart = (data: ProductStruct): void => {
    if(token !== "") {
        dispatch(addToCart(data))
        execToast(ToastStatus.SUCCESS, `Sukses menambahkan item ${data.nama_produk} ke cart`)
    } else {
        router.push("/login")
    }
  };

  React.useEffect(() => {
    listProductHandler()
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
                          Products Details
                      </Typography>
                      <Image
                        draggable={false}
                        src={
                          detailProduct.gambar_url as string
                        }
                        alt="Example"
                        style={{
                            objectFit: "cover"
                        }}
                        layout="responsive"
                        width={0}
                        height={200}
                    />
                      <Typography variant="h6" component="h2" id="modal-modal-description" sx={{ mt: 2 }}>
                          {detailProduct.nama_produk}
                      </Typography>
                      <Typography variant="h6" component="h2" id="modal-modal-description">
                        IDR {
                          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detailProduct.harga)
                        }
                      </Typography>
                      <Typography id="modal-modal-description">
                          Stok : {detailProduct.stok}
                      </Typography>
                      <Typography 
                        id="modal-modal-description" 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center",
                          gap: 1,
                        }}
                        >
                          Rating : 
                          <Rating
                            name="simple-controlled"
                            readOnly
                            value={detailProduct.rating}
                          />
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Deskripsi : 
                      </Typography>
                      <Typography id="modal-modal-description" sx={{whiteSpace: "pre-line"}}>
                        {detailProduct.deskripsi.trim()}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Kategori Produk : {KategoriData[detailProduct.kategori_id]}
                      </Typography>
                      <hr style={{marginTop: "1.25%"}} />
                      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginTop: "1.25%"}}>
                          Rating & Komentar
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
                        Rating Anda : 
                        <Rating
                          name="simple-controlled"
                          value={starValue}
                          onChange={(event, newValue) => {
                            setStarValue(newValue);
                          }}
                        />
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
                          postCommentHandler(token, detailProduct.id_produk as string)
                        }}
                      >
                        Kirim komentar
                      </Button>
                      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginTop: "1.25%"}}>
                        Daftar Komentar Pelanggan
                      </Typography>
                      {
                        comments.map(comment => {
                          return (
                          <Box sx={{margin: "1.25%", padding: "1.25%", border: "1px solid black"}}>
                            <Box 
                              sx={{ 
                                display: "flex", 
                                alignItems: "flex-start", 
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
                                <Rating value={parseInt(comment.rating)} readOnly />
                              </Box>
                            </Box>
                            <Typography id="modal-modal-description" sx={{fontSize: 14, mt: 1, whiteSpace: "pre-line"}}>
                              {comment.komentar}
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
        {
            role !== "user" && role !== "" && (
            <Button 
                variant='contained'
                onClick={() => {
                    router.push(`/editproduct?add=1`)
                }}
                sx={{
                    marginLeft: "26.5%",
                    marginTop: "1.5%"
                }}
            >
                + Add Product
            </Button>
            )
        }
        <Grid container>
            <Grid size={3}>
                <Item>
                    <Typography variant='body1' textAlign={"left"}>
                        Dashboard Pengaturan
                    </Typography>
                    <Autocomplete
                        disablePortal
                        options={products.map(data => data.nama_produk)}
                        sx={{ 
                          maxWidth: "100%", 
                          marginTop: "5%",
                          textAlign: "left", 
                          display: 'flex', 
                          alignItems: 'flex-start'
                        }}
                        onChange={(_, value: string | null) => {
                          handleSearchChange(value || ''); 
                        }}
                        renderInput={params => (
                          <TextField
                            value={search}
                            {...params}
                            label=""
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "left", 
                              display: 'flex', 
                              alignItems: 'flex-start'
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                            variant="outlined"
                            fullWidth
                          />
                        )}
                    />
                    <Accordion 
                      onRatingChange={(rating: number[]) => {
                        setRatingFilter(rating)
                      }}
                      onCategoryChange={(category: Kategori[]) => {
                        setCategoryFilter(category)
                      }}
                      onSortChange={(sort: SortConfig) => {
                        setSortConfig(sort)
                      }}
                    />
                </Item>
            </Grid>
            <Grid container size={9} alignItems="stretch">
                {/* role === "user" */} 
                {
                    filteredProducts && 
                    (
                      ratingFilter.length > 0
                      ? filteredProducts.filter((product) => {
                        if (ratingFilter.length === 0) return true;
                        return ratingFilter.some((rating) => {
                          return product.rating === rating;
                        });
                      })
                      : categoryFilter.length > 0
                        ? filteredProducts.filter((product) => {
                          if (categoryFilter.length === 0) return true;
                          return categoryFilter.some((kategori) => {
                            return KategoriData[product.kategori_id] === kategori;
                          });
                        })
                        : sortConfig.order !== "" && sortConfig.orderBy !== ""
                          ? [...filteredProducts].sort((a, b) => {
                            const valueA = a[sortConfig.orderBy as keyof ProductStruct];
                            const valueB = b[sortConfig.orderBy as keyof ProductStruct];
                        
                            if (valueA == null && valueB == null) return 0;
                            if (valueA == null) return sortConfig.order === "a" ? 1 : -1;
                            if (valueB == null) return sortConfig.order === "a" ? -1 : 1;
                        
                            if (typeof valueA === "string" && typeof valueB === "string") {
                              return sortConfig.order === "a"
                                ? valueA.localeCompare(valueB)
                                : valueB.localeCompare(valueA);
                            } else if (typeof valueA === "number" && typeof valueB === "number") {
                              return sortConfig.order === "a" ? valueA - valueB : valueB - valueA;
                            }
                            return 0;
                          })
                          : filteredProducts
                    ).map((data, index) => {
                        return (
                            <>
                                <Grid size={3}>
                                    <Item>
                                        <Card
                                            key={`${data.id_produk}_${index}`}
                                            title={data.nama_produk}
                                            description={data.deskripsi.trim()}
                                            image_url={data.gambar_url}
                                            withImage
                                            onClickCard={() => {
                                              if(role && role.length > 0) {
                                                if(role === "user") {
                                                    listCommentHandler(data.id_produk as string)
                                                    handleOpen()
                                                    setDetailID(data.id_produk as string)
                                                    setDetailProduct(data)
                                                } else {
                                                    router.push(`/editproduct?id=${data.id_produk}`)
                                                }
                                              } else {
                                                router.push("/login")
                                              }
                                            }}
                                            onClickSecondaryCard={() => {
                                              if(role && role.length > 0) {
                                                if(role !== "user") {
                                                  deleteProductHandler(data.id_produk as string)
                                                } else {
                                                  handleAddToCart(data)
                                                }
                                              } else {
                                                router.push("/login")
                                              }
                                            }}
                                        />
                                    </Item>
                                </Grid>
                            </>
                        )
                    })
                }
            </Grid>
        </Grid>
    <Footer />
   </Box>
  );
}