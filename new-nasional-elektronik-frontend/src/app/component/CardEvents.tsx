import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumIcon from '@mui/icons-material/Forum';

export default function CardEvents() {
  return (
    <Card sx={{ maxWidth: "100%" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" textAlign={"left"}>
          Nama Event
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify" }}>
          28/11/2024
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "justify", marginTop: "2.5%" }}>
          Deskripsi Events
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ ml: 'auto' }}>
          500
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="more options">
            <ForumIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}