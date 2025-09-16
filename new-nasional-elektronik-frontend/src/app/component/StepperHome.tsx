/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Image from 'next/image';
import Stepper1 from '../public/stepper_1.png'
import Stepper2 from '../public/stepper_2.png'
import Stepper3 from '../public/stepper_3.png'

const steps = ['Pelayanan ramah', 'Berdiri sejak 2014', 'Brand terpercaya'];
const stepsContent = [
  {
    image: Stepper1,
    title: "Customer is #1",
    description: ` 
      Kami hadir dengan rangkaian produk terbaik dan layanan yang mengutamakan Anda.
      Belanja di sini adalah keputusan yang tepat untuk kepuasan Anda!
    `,
  },
  {
    image: Stepper2,
    title: "Serving trust and experience",
    description: ` 
      Sejak 2014, kami hadir dengan pengalaman dan kepercayaan terbaik. 
      Kami tetap menerima masukkan dan saran dari customer kami sebagai perubahan yang tak terhentikkan
    `,
  },
  {
    image: Stepper3,
    title: "Trusted & warranty brand",
    description: ` 
      Produk yang kami jual adalah merek terpercaya dengan jaminan kualitas. 
      Setiap produk yang Anda beli dilindungi oleh garansi untuk kepuasan dan keamanan berbelanja Anda!
    `,
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: '100%', padding: "2.5% 5%" }}>
      <Typography variant='h5' sx={{ mt: 2, mb: 1, py: 1 }}>
        Mengapa belanja di <span style={{fontWeight: "bold"}}>New Nasional (Diamond Electronic) ?</span>
      </Typography>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color={"white"} onClick={handleStep(index)}>
            <span style={{color: "white"}}>
                {label}
            </span> 
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box 
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
          padding: "0 15%"
        }}
      >
        <Grid container spacing={2}>
          <Grid size={4}>
            <Item>
              <Image
                draggable={false}
                src={
                  stepsContent[activeStep].image
                }
                alt="Example"
                layout="responsive"
                width={0}
                height={200}
              />
            </Item>
          </Grid>
          <Grid size={8} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Item>
              <Typography variant="h4" component="h2" color='white' textAlign={"left"}>
                {stepsContent[activeStep].title}
              </Typography>
              <Typography variant="body2" component="h2" color='white' textAlign={"left"} whiteSpace={"pre-line"}>
                {stepsContent[activeStep].description}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}