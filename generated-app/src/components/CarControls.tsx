import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface CarControlsProps {
  onApplySearchSort: (search: string, sort: string) => void;
  addCar: (car: { make: string; model: string; year: number; color: string }) => Promise<void>;
}

export const CarControls: React.FC<CarControlsProps> = ({ onApplySearchSort, addCar }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState({ make: '', model: '', year: '', color: '' });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSort(event.target.value as string);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewCar({ make: '', model: '', year: '', color: '' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCar = async () => {
    await addCar({ make: newCar.make, model: newCar.model, year: parseInt(newCar.year), color: newCar.color });
    handleDialogClose();
  };

  const handleApplySearchSort = () => {
    onApplySearchSort(search, sort);
  };

  return (
    <div>
      <TextField
        label="Search by Model"
        value={search}
        onChange={handleSearchChange}
        variant="outlined"
      />
      <Select
        value={sort}
        onChange={handleSortChange}
        displayEmpty
        variant="outlined"
      >
        <MenuItem value="">
          <em>Sort by</em>
        </MenuItem>
        <MenuItem value="year">Year</MenuItem>
        <MenuItem value="make">Make</MenuItem>
      </Select>
      <Button onClick={handleApplySearchSort}>Apply Search/Sort</Button>
      <Button onClick={handleDialogOpen}>Add New Car</Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Car</DialogTitle>
        <DialogContent>
          <TextField
            label="Make"
            name="make"
            value={newCar.make}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Model"
            name="model"
            value={newCar.model}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Year"
            name="year"
            value={newCar.year}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            label="Color"
            name="color"
            value={newCar.color}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddCar}>Add Car</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};