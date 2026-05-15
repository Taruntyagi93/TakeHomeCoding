import React from "react";
import { Container, Typography, Box, Grid, CircularProgress, Alert } from "@mui/material";
import { useCars } from "./hooks/useCars";
import { CarCard } from "./components/CarCard";
import { CarControls } from "./components/CarControls"; // Red line should be gone now!

export default function App() {
  const { cars, loading, error, searchTerm, setSearchTerm, sortOption, setSortOption, addCar } = useCars();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Car Inventory Manager
      </Typography>

      {/* Passed the exact props your CarControls component is expecting */}
      <CarControls 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortOption as any}
        onSortChange={setSortOption}
        onAddCar={addCar}
      />

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading inventory: {error.message}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {cars.map((car: any) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              <CarCard 
                make={car.make} 
                model={car.model} 
                year={car.year} 
                color={car.color} 
                mobile={car.mobile} 
                tablet={car.tablet} 
                desktop={car.desktop} 
              />
            </Grid>
          ))}
          {cars.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>No cars found.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}