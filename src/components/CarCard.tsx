import React from "react";
import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";

export const CarCard = ({ make, model, year, color, mobile, tablet, desktop }: any) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' }
      }}
    >
      <Box
        sx={{
          height: 200,
          width: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: {
            xs: `url(${mobile})`,
            sm: `url(${tablet})`,
            md: `url(${desktop})`
          }
        }}
        role="img"
        aria-label={`${year} ${make} ${model}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          {make} {model}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label={`Year: ${year}`} color="primary" variant="outlined" />
          <Chip label={`Color: ${color}`} variant="outlined" sx={{ textTransform: 'capitalize' }} />
        </Stack>
      </CardContent>
    </Card>
  );
};