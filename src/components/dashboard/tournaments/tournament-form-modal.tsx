import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// Material-UI components
import { TextField, Button, Typography, Box, Grid } from '@mui/material';

interface Event {
    gender: string;
    format: string;
    ageCap: string;
    levelLimit: string;
    description: string;
  }

interface Tournament {
    name: string;
    description: string;
    location: string;
    date: string;
    events?: Event[];
    registrationEndDate?: string;
  }
  

interface TournamentFormModalProps {
  initialData?: Tournament | null;
  onSubmit: (tournament: Tournament) => void;
  onClose: () => void;
}

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({ initialData, onSubmit, onClose }) => {
    const [tournament, setTournament] = useState<Tournament>({
      name: '',
      description: '',
      location: '',
      date: '',
      registrationEndDate: '',
    });
  
    useEffect(() => {
      if (initialData) {
        setTournament(initialData);
      }
    }, [initialData]);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTournament((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit({ ...tournament }); // Ensure all data, including initial `id`, is passed to `onSubmit`
      onClose();
    };
  
    return (
      <Box
        sx={{
          padding: 3,
          maxHeight: '80vh',
          overflowY: 'auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {initialData ? 'Edit Tournament' : 'Create Tournament'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Tournament Name"
                value={tournament.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={tournament.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={tournament.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Tournament Date"
                InputLabelProps={{ shrink: true }}
                value={tournament.date}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                name="registrationEndDate"
                label="Registration End Date"
                InputLabelProps={{ shrink: true }}
                value={tournament.registrationEndDate}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {initialData ? 'Save Changes' : 'Create Tournament'}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          fullWidth
        >
          Cancel
        </Button>
      </Box>
    );
  };
  
  export default TournamentFormModal;
  