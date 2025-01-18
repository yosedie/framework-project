/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { StepIconProps } from '@mui/material/StepIcon';

import StoreIcon from '@mui/icons-material/Store';
import PhonelinkIcon from '@mui/icons-material/Phonelink';


import Image from 'next/image';
import Stepper4 from '../public/stepper_4.png'
import Stepper5 from '../public/stepper_5.png'

const steps = ['Offline', 'Online'];
const stepsContent = [
  {
    image: Stepper4,
    title: "Secara online",
    description: ` 
      Mulai dari tahun 2024, kami sudah membuka toko new nasional didalam website ini.
      Fitur online ini adalah fitur terbaru kami yang didesain dengan fitur - fitur baru sehingga bisa menjangkau banyak pelanggan 
    `,
  },
  {
    image: Stepper5,
    title: "Hadir di tempat",
    description: ` 
      Sistem yang sudah kami bangun semenjak tahun 2014, dan masih saat ini berjalan lancar.
      Dengan hadir di tempat anda akan menikmati suasana dan layanan toko kami.
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

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<any> } = {
    1: <PhonelinkIcon />,
    2: <StoreIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: '100%', padding: "2.5% 5%" }}>
      <Typography variant='h5' sx={{ mt: 2, mb: 1, py: 1 }} textAlign={"right"}>
        Bagaimana cara belanja di <span style={{fontWeight: "bold"}}>New Nasional ?</span>
      </Typography>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color={"white"} onClick={handleStep(index)}>
              <StepLabel StepIconComponent={ColorlibStepIcon}></StepLabel>
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
                {stepsContent[activeStep].title} {activeStep === 0 && (<span style={{color: "gold"}}>FITUR BARU !</span>)}
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