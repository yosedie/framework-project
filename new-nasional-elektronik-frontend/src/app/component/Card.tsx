import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Role } from '../types/types';

type ImgMediaCardProps = {
  title?: string;
  description?: string;
  image_url?: string;
  height?: number;
  isDescriptionTitle?: boolean;
  isHorizontal?: boolean;
  isActionDelete?: boolean;
  fullWidth?: boolean;
  withImage?: boolean;
  marginTopParam?: string;
  onClickCard?: (data: any) => void;
  onDeleteClickCard?: (data: any) => void;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function ImgMediaCard({ 
  title, 
  description,
  image_url,
  height,
  isDescriptionTitle, 
  isHorizontal,
  isActionDelete,
  fullWidth,
  withImage,
  marginTopParam,
  onClickCard,
  onDeleteClickCard
}: ImgMediaCardProps) {
  const role = useSelector((state: RootState) => state.user.role)
  return (
    <Card sx={{ 
      maxWidth: fullWidth ? "100%" : 345, 
      marginTop: marginTopParam,
      height: height || height != 0 ? height : 325
    }}>
      {
        isHorizontal
        ? (
        <Grid container spacing={1}>
          {
            withImage
            ? (
              <>
                <Grid size={fullWidth ? 2 : 6}>
                  <Item>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      image={image_url}
                    />
                  </Item>
                </Grid>
                <Grid size={fullWidth ? 10 : 6}>
                  <Item sx={{boxShadow: "none"}}>
                    {/* <CardContent> */}
                    <Typography gutterBottom variant="h5" component="div" color='black' textAlign={"left"}>
                      {title}
                    </Typography>
                    {
                      isActionDelete
                      ? (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                              variant={isDescriptionTitle ? "h5" : "body2"} 
                              color={isDescriptionTitle ? "black" : "text.secondary"} 
                              textAlign={isDescriptionTitle ? "left" : "justify"}
                              sx={{ flex: 1 }}
                            >
                              {description}
                            </Typography>
                            <Button variant="contained" sx={{ marginLeft: 'auto', marginRight: "1.5%" }} color="error" onClick={onDeleteClickCard}>
                              Delete
                            </Button>
                          </Box>
                        </>
                      )
                      : (
                        <>
                          <Typography 
                            variant={isDescriptionTitle ? "h5" : "body2"} 
                            color={isDescriptionTitle ? "black" : "text.secondary"} 
                            textAlign={isDescriptionTitle ? "left" : "justify"}
                            sx={{ flex: 1 }}
                          >
                            {description}
                          </Typography>
                        </>
                      )
                    }
                    
                    {/* </CardContent> */}
                  </Item>
                </Grid>
              </>
            )
            : (
            <Grid container={fullWidth} size={
              12
            } margin={".75%"}>
              <Grid size={6}>
                  <Item sx={{boxShadow: "none"}}>
                    {/* <CardContent> */}
                      <Typography gutterBottom variant="h5" component="div" color='black' textAlign={"left"}>
                        {title}
                      </Typography>
                      {
                        isDescriptionTitle
                        ? (
                          <Typography gutterBottom variant="h5" component="div" color='black' textAlign={"left"}>
                            {description}
                          </Typography>
                        )
                        : (
                          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify" }}>
                            {description}
                          </Typography>
                        )
                      }
                    {/* </CardContent> */}
                  </Item>
              </Grid>
              <Grid size={6}>
                  <Item sx={{boxShadow: "none", textAlign: "right "}}>
                    {/* <CardContent> */}
                    <Button variant="contained" sx={{width: "175px"}} onClick={onClickCard}>Next</Button> <br />
                    <Button variant="contained" sx={{width: "175px", marginTop: ".5%"}} color="error" onClick={onDeleteClickCard}>
                      Delete all items
                    </Button>
                    {/* </CardContent> */}
                  </Item>
              </Grid>
            </Grid>
            )
          }
        </Grid>
        )
        : (
          <Box>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={image_url}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify", whiteSpace: "pre-line" }}>
                {description}
              </Typography>
            </CardContent>
            <CardActions>
              {/* <Button size="small">View</Button> */}
              {
                role === "" || role === "user"
                ? (
                  <Button 
                    variant="contained" 
                    size="small" 
                    sx={{
                      margin: "0 auto",
                    }}
                    fullWidth 
                    onClick={onClickCard}
                  >
                    Add to Cart
                  </Button>
                )
                : (
                  <Grid container size={12} spacing={6}>
                      <Grid size={6}>
                        <Item sx={{boxShadow: "0"}}>
                          <Button 
                            variant="contained" 
                            color="warning"
                            size="small" 
                            sx={{margin: "0 auto"}} 
                            fullWidth 
                            onClick={onClickCard}
                          >
                            Edit
                          </Button>
                        </Item>
                      </Grid>
                      <Grid size={6}>
                        <Item sx={{boxShadow: "0"}}>
                          <Button 
                            variant="contained" 
                            color="error"
                            size="small" 
                            sx={{margin: "0 auto"}} 
                            fullWidth 
                            onClick={onDeleteClickCard}
                          >
                            Delete
                          </Button>
                        </Item>
                      </Grid>
                  </Grid>
                )
              }
            </CardActions>
          </Box>
        )
      }
    </Card>
  );
}