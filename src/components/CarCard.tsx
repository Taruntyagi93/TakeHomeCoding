import React from "react";
import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";

interface CarCardProps {
  make: string;
  model: string;
  year: number;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

// CRITICAL: Must be a named export to match App.tsx imports
export function CarCard({ 
  make, 
  model, 
  year, 
  color, 
  mobile, 
  tablet, 
  desktop 
}: CarCardProps) {
  
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
      {/* Responsive Image Box using MUI breakpoints */}
      <Box
        sx={{
          height: 200,
          width: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Hot-swaps the image URL based on viewport width
          backgroundImage: {
            xs: `url(${mobile})`,    // <= 640px
            sm: `url(${tablet})`,    // 641px - 1023px
            md: `url(${desktop})`    // >= 1024px
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
          <Chip 
            label={`Color: ${color}`} 
            variant="outlined" 
            sx={{ textTransform: 'capitalize' }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}