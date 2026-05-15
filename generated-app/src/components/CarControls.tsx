import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export const CarControls = ({ onApplySearchSort, addCar }: { onApplySearchSort: (term: string, sort: string) => void, addCar: (newCar: { make: string; model: string; year: number; color: string }) => Promise<void> }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('year');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCar, setNewCar] = useState({ make: '', model: '', year: 0, color: '' });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortOption(event.target.value as string);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewCar(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCar = async () => {
        await addCar(newCar);
        setNewCar({ make: '', model: '', year: 0, color: '' });
        handleDialogClose();
    };

    return (
        <div>
            <TextField
                label="Search by Model"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FormControl>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOption} onChange={handleSortChange}>
                    <MenuItem value="year">Year</MenuItem>
                    <MenuItem value="make">Make</MenuItem>
                </Select>
            </FormControl>
            <Button onClick={() => onApplySearchSort(searchTerm, sortOption)}>Apply</Button>
            <Button onClick={handleDialogOpen}>Add New Car</Button>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Add New Car</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Make"
                        name="make"
                        value={newCar.make}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Model"
                        name="model"
                        value={newCar.model}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Year"
                        name="year"
                        type="number"
                        value={newCar.year}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Color"
                        name="color"
                        value={newCar.color}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleAddCar}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};