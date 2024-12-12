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

type ImgMediaCardProps = {
  title?: string;
  description?: string;
  image_url?: string;
  isDescriptionTitle?: boolean;
  isHorizontal?: boolean;
  fullWidth?: boolean;
  withImage?: boolean;
  marginTopParam?: string;
  onClickCard?: (data: any) => void;
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
  isDescriptionTitle, 
  isHorizontal,
  fullWidth,
  withImage,
  marginTopParam,
  onClickCard 
}: ImgMediaCardProps) {
  return (
    <Card sx={{ maxWidth: fullWidth ? "100%" : 345, marginTop: marginTopParam }}>
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
                    <Button variant="contained" sx={{width: "175px"}}>Next</Button> <br />
                    <Button variant="contained" sx={{width: "175px", marginTop: ".5%"}} color="error">
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
          <>
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
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify" }}>
                {description}
              </Typography>
            </CardContent>
            <CardActions>
              {/* <Button size="small">View</Button> */}
              <Button variant="contained" size="small" sx={{margin: "0 auto"}} fullWidth onClick={onClickCard}>Add to Cart</Button>
            </CardActions>
          </>
        )
      }
    </Card>
  );
}