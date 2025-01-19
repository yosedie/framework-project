/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { RootState } from '../util/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { Role } from '../types/types';

type ImgMediaCardProps = {
  quantity?: number;
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
  onClickSecondaryCard?: (data: any) => void;
  onClickAddQuantity?: (data: any) => void;
  onClickRemoveQuantity?: (data: any) => void;
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
  quantity,
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
  onClickSecondaryCard,
  onClickAddQuantity,
  onClickRemoveQuantity
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
                            <Box sx={{textAlign: "left"}}>
                              <Typography 
                                variant={isDescriptionTitle ? "h5" : "body2"} 
                                color={isDescriptionTitle ? "black" : "text.secondary"} 
                                textAlign={isDescriptionTitle ? "left" : "justify"}
                                sx={{ 
                                  flex: 1, 
                                  display: '-webkit-box', 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis', 
                                  WebkitBoxOrient: 'vertical', 
                                  WebkitLineClamp: 3,
                                }}
                              >
                                {description}
                              </Typography>
                              <IconButton aria-label="remove" onClick={onClickRemoveQuantity}>
                                <RemoveIcon />
                              </IconButton>
                              <Typography 
                                variant={"body2"} 
                                color={"black"}
                                display={"inline"}
                                margin={"0 5%"}
                              >
                                {quantity}
                              </Typography>
                              <IconButton aria-label="add" onClick={onClickAddQuantity}>
                                <AddIcon />
                              </IconButton>
                            </Box>
                            <Button variant="contained" sx={{ marginLeft: 'auto', marginRight: "1.5%" }} color="error" onClick={onClickSecondaryCard}>
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
                            sx={{ 
                              flex: 1, 
                              display: '-webkit-box', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              WebkitBoxOrient: 'vertical', 
                              WebkitLineClamp: 3, 
                            }}
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
                    <Button variant="contained" sx={{width: "175px", marginTop: ".5%"}} color="error" onClick={onClickSecondaryCard}>
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
              <Typography gutterBottom variant="h5" component="div" sx={{
                flex: 1, 
                display: '-webkit-box', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                WebkitBoxOrient: 'vertical', 
                WebkitLineClamp: 2
              }}>
                {title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  textAlign: "left", 
                  whiteSpace: "pre-line", 
                  flex: 1, 
                  display: '-webkit-box', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  WebkitBoxOrient: 'vertical', 
                  WebkitLineClamp: 3
                }}
                >
                {description}
              </Typography>
            </CardContent>
            <CardActions>
              {/* <Button size="small">View</Button> */}
              {
                role === "" || role === "user"
                ? (
                  <Grid container size={12} spacing={1}>
                      <Grid size={6}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          sx={{
                            margin: "0 auto",
                          }}
                          fullWidth 
                          onClick={onClickCard}
                        >
                          Details Product
                        </Button>
                      </Grid>
                      <Grid size={6}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          sx={{
                            margin: "0 auto",
                          }}
                          fullWidth 
                          onClick={onClickSecondaryCard}
                        >
                          Add to Cart
                        </Button>
                      </Grid>
                  </Grid>
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
                            onClick={onClickSecondaryCard}
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