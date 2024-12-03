import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent
// Material-UI components
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

interface Event {
  gender: string;
  format: string;
  ageCap: string;
  levelLimit: string;
  description: string;
}

interface EventFormModalProps {
  initialData?: Event | null;
  onClose: () => void;
  onSubmit: (event: Event) => void;
}

const EventFormModal: React.FC<EventFormModalProps> = ({ initialData, onClose, onSubmit }) => {
  const [event, setEvent] = useState<Event>({
    gender: 'Mixed',
    format: 'Doubles',
    ageCap: '',
    levelLimit: '2',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setEvent(initialData);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as { name: string; value: string }; // Explicitly assert the shape of the target
    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(event);
    setEvent({
      gender: 'Mixed',
      format: 'Doubles',
      ageCap: '',
      levelLimit: '2',
      description: '',
    });
    onClose(); // Close modal after submission
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Event' : 'Add Event'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Gender Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={event.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Mixed">Mixed</MenuItem>
                <MenuItem value="Mens">Mens</MenuItem>
                <MenuItem value="Womens">Womens</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Format Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                name="format"
                value={event.format}
                onChange={handleChange}
                label="Format"
              >
                <MenuItem value="Doubles">Doubles</MenuItem>
                <MenuItem value="Singles">Singles</MenuItem>
                <MenuItem value="Skinny Singles">Skinny Singles</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Age Cap Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              name="ageCap"
              label="Age Cap"
              value={event.ageCap}
              onChange={handleChange}
              placeholder="Enter Age Cap"
            />
          </Grid>

          {/* Level Limit Select */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Level Limit</InputLabel>
              <Select
                name="levelLimit"
                value={event.levelLimit}
                onChange={handleChange}
                label="Level Limit"
              >
                {[...Array(13)].map((_, i) => (
                  <MenuItem key={i} value={(2 + i * 0.5).toFixed(1)}>
                    {(2 + i * 0.5).toFixed(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Description Input */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={event.description}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Enter event description"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {initialData ? 'Save Changes' : 'Add Event'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Close Button */}
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

export default EventFormModal;
