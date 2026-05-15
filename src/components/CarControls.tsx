import { useState } from "react";
import { 
  Box, TextField, MenuItem, Button, Grid, 
  Dialog, DialogTitle, DialogContent, DialogActions, Alert 
} from "@mui/material";

// FIX 1: Define the type locally instead of importing it
export type SortOption = "make" | "year" | ""; 

interface CarControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onAddCar: (car: { make: string; model: string; year: number; color: string }) => Promise<void>;
  addLoading?: boolean;
  addError?: Error | null;
}

// FIX 2: Change "export default function" to "export function" (Named Export)
export function CarControls({ 
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddCar,
  addLoading = false,
  addError,
}: CarControlsProps) {
  const [open, setOpen] = useState(false);
  const [newCar, setNewCar] = useState({ make: "", model: "", year: new Date().getFullYear(), color: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setNewCar({ make: "", model: "", year: new Date().getFullYear(), color: "" });
    setFormError(null);
  };

  const handleAddSubmit = async () => {
    if (!newCar.make || !newCar.model || !newCar.color) {
      setFormError("Please complete all fields before adding a car.");
      return;
    }

    setFormError(null);

    try {
      await onAddCar(newCar);
      setOpen(false);
      resetForm();
    } catch (error) {
      setFormError((error as Error)?.message || "Unable to add car. Please try again.");
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search by Model"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Sort By"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <MenuItem value="make">Make (A-Z)</MenuItem>
            <MenuItem value="year">Year (Newest)</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            onClick={() => setOpen(true)}
            sx={{ height: '56px' }}
          >
            Add New Car
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add a New Car</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          {addError && <Alert severity="error">{addError.message}</Alert>}
          <TextField
            label="Make"
            value={newCar.make}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Year"
            type="number"
            inputProps={{ min: 1886, max: new Date().getFullYear() + 1 }}
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
            fullWidth
            required
          />
          <TextField
            label="Color"
            value={newCar.color}
            onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
            disabled={addLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>
            {addLoading ? "Adding..." : "Add Car"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}