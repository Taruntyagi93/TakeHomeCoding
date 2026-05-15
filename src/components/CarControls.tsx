import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export const CarControls = ({ 
  onApplySearchSort, 
  addCar 
}: { 
  onApplySearchSort: (term: string, sort: string) => void;
  addCar: (newCar: { make: string; model: string; year: number; color: string }) => Promise<void>;
}) => {
  const [draftSearch, setDraftSearch] = useState('');
  const [draftSort, setDraftSort] = useState('');
  
  const [open, setOpen] = useState(false);
  const [newCar, setNewCar] = useState({ make: '', model: '', year: new Date().getFullYear(), color: '' });

  const handleApply = () => {
    onApplySearchSort(draftSearch, draftSort);
  };

  const handleAddSubmit = async () => {
    await addCar(newCar);
    setOpen(false);
    setNewCar({ make: '', model: '', year: new Date().getFullYear(), color: '' });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by Model or Make"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Sort By"
            value={draftSort}
            onChange={(e) => setDraftSort(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="make">Make (A-Z)</MenuItem>
            <MenuItem value="year">Year (Newest)</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button fullWidth variant="outlined" size="large" onClick={handleApply} sx={{ height: '56px' }}>
            Apply
          </Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button fullWidth variant="contained" size="large" onClick={() => setOpen(true)} sx={{ height: '56px' }}>
            Add New Car
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add a New Car</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Make" value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} fullWidth required />
          <TextField label="Model" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} fullWidth required />
          <TextField label="Year" type="number" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })} fullWidth required />
          <TextField label="Color" value={newCar.color} onChange={(e) => setNewCar({ ...newCar, color: e.target.value })} fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained">Add Car</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};