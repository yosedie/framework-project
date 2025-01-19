/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { Kategori, KategoriData, SortConfig } from '../types/types';


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

const sortByList = [
  "rating",
  "nama_produk",
]

type AccordionPropsFunc = {
  onRatingChange: (data: number[]) => void;
  onCategoryChange: (data: any) => void;
  onSortChange: (data: any) => void;
}

export default function AccordionDashboard(
  {
    onRatingChange,
    onCategoryChange,
    onSortChange,
  }: AccordionPropsFunc
) {

  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    order: "",
    orderBy: "",
  });
  const [checkedValuesRating, setCheckedValuesRating] = React.useState<number[]>([]);
  const [checkedValuesCategory, setCheckedValuesCategory] = React.useState<Kategori[]>([]);
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleClick = (value: string) => {
    if (value === sortConfig.orderBy) {
      setSortConfig(prevState => ({
        ...prevState,
        orderBy: "",
      }))
    } else {
      setSortConfig(prevState => ({
        ...prevState,
        orderBy: value,
      }))
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, value: number) => {
    setCheckedValuesRating(prev => 
      event.target.checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );
  };
  const handleCheckboxChangeCategory = (event: React.ChangeEvent<HTMLInputElement>, value: Kategori) => {
    setCheckedValuesCategory(prev => 
      event.target.checked 
        ? [...prev, value] 
        : prev.filter(item => item !== value)
    );
  };

  const handleChangeSort = (event: SelectChangeEvent) => {
    setSortConfig(prevState => ({
      ...prevState,
      order: event.target.value,
    }))
  };

  React.useEffect(() => {
    onRatingChange(checkedValuesRating)
  }, [checkedValuesRating])
  React.useEffect(() => {
    onCategoryChange(checkedValuesCategory)
  }, [checkedValuesCategory])
  React.useEffect(() => {
    onSortChange(sortConfig)
  }, [sortConfig])


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
              const value = index + 1;
              return (
                <FormControlLabel 
                  key={value}
                  control={
                    <Checkbox
                      checked={checkedValuesRating.includes(value)}
                      onChange={(e) => handleCheckboxChange(e, value)}
                    />
                  }
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
            KategoriData.map(category => {
              return (
                <FormControlLabel 
                  key={category}
                  control={
                  <Checkbox 
                    checked={checkedValuesCategory.includes(category)}
                    onChange={(e) => handleCheckboxChangeCategory(e, category)}
                  />
                  } 
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
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sortConfig.order}
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
          <RadioGroup
            name="sort-by-group"
            value={sortConfig.orderBy || ''}
          >
            {
              sortByList.map((sortBy, index) => {
                return (
                  <FormControlLabel 
                    key={index}
                    value={sortBy}
                    control={<Radio onClick={() => handleClick(sortBy)} />}
                    label={sortBy === "rating" ? "Rating" : "Nama"}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  />
                )
              })
            }
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}