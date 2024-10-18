import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const categoryList = [
  "Mesin Cuci",
  "AC",
  "Kulkas",
  "Kompor",
  "Rice Cooker",
  "TV",
  "Anthena",
  "Freeze Box",
]
const sortByList = [
  "Rating",
  "Nama",
  "Terjual",
]

export default function AccordionDashboard() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [sort, setSort] = React.useState('');

  const handleChangeSort = (event: SelectChangeEvent) => {
    setSort(event.target.value);
  };


  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Ratings</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <FormGroup>
          {
            Array.from({ length: 5 }, (_, index) => {
              return (
                <FormControlLabel 
                  control={<Checkbox />} 
                  label={
                    <Rating name="read-only" value={index+1} readOnly />
                  } 
                />
              )
            }).reverse()
          }
        </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            categoryList.map(category => {
              return (
                <FormControlLabel 
                  control={<Checkbox />} 
                  label={
                    category
                  }
                  style={{
                    display:"block",
                    width: "100%",
                    textAlign: "left",
                  }} 
                />

              )
            })
          }
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ 
            m: 1, 
            margin: "5% 0", 
            textAlign: "left", 
            display: 'flex', 
            alignItems: 'flex-start'
          }}>
            <InputLabel id="demo-simple-select-helper-label">Urutan</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sort}
              label="Naik / Turun"
              onChange={handleChangeSort}
              sx={{width: "80%"}}
            >
              <MenuItem value="">
                <em>-</em>
              </MenuItem>
              <MenuItem value={"a"}>Ascending</MenuItem>
              <MenuItem value={"d"}>Descending</MenuItem>
            </Select>
            <FormHelperText>Ascending = Urutan dari rendah</FormHelperText>
            <FormHelperText>Descending = Urutan dari tinggi</FormHelperText>
          </FormControl>
          {
            sortByList.map(category => {
              return (
                <FormControlLabel 
                  control={<Checkbox />} 
                  label={
                    category
                  }
                  style={{
                    display:"block",
                    width: "100%",
                    textAlign: "left",
                  }} 
                />

              )
            })
          }
        </AccordionDetails>
      </Accordion>
    </div>
  );
}