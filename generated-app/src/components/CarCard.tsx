import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

export const CarCard = ({ make, model, year, color, mobile, tablet, desktop }: any) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt={`${make} ${model}`}
        src={mobile}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      />
      <CardMedia
        component="img"
        alt={`${make} ${model}`}
        src={tablet}
        sx={{
          display: { xs: 'none', sm: 'block', md: 'none' },
        }}
      />
      <CardMedia
        component="img"
        alt={`${make} ${model}`}
        src={desktop}
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {make} {model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Year: {year}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Color: {color}
        </Typography>
      </CardContent>
    </Card>
  );
};