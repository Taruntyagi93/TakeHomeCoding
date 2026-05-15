import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { SxProps } from '@mui/system';

interface CarCardProps {
  make: string;
  model: string;
  year: number;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

export const CarCard: React.FC<CarCardProps> = ({ make, model, year, color, mobile, tablet, desktop }) => {
  const backgroundImageStyles: SxProps = {
    backgroundImage: {
      xs: `url(${mobile})`, // Mobile
      sm: `url(${tablet})`, // Tablet
      md: `url(${desktop})`, // Desktop
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300px',
    display: 'flex',
    alignItems: 'flex-end',
    color: 'white',
    padding: '16px',
  };

  return (
    <Card sx={{ ...backgroundImageStyles, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
      <CardContent>
        <Typography variant="h5">{`${make} ${model}`}</Typography>
        <Typography variant="body2">{`Year: ${year}`}</Typography>
        <Typography variant="body2">{`Color: ${color}`}</Typography>
      </CardContent>
    </Card>
  );
};