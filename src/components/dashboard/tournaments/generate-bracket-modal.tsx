import React, { useState, ChangeEvent } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';

interface GenerateBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { bracketType: string }) => void;
}

const GenerateBracketModal: React.FC<GenerateBracketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [bracketType, setBracketType] = useState<string>('');
  const [includePoolPlay, setIncludePoolPlay] = useState<boolean>(false);

  const handleBracketChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBracketType(event.target.value);
  };

  const handleGenerate = () => {
    onSubmit({ bracketType });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          width: '400px',
          margin: 'auto',
          mt: '20vh',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Generate Bracket
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Bracket Format</FormLabel>
          <RadioGroup value={bracketType} onChange={handleBracketChange}>
            <FormControlLabel value="roundRobin" control={<Radio />} label="Round Robin" />
            <FormControlLabel value="doubleElimination" control={<Radio />} label="Double Elimination" />
            <FormControlLabel value="singleElimination" control={<Radio />} label="Single Elimination" />
          </RadioGroup>
        </FormControl>

        {bracketType !== 'roundRobin' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={includePoolPlay}
                onChange={(e) => setIncludePoolPlay(e.target.checked)}
              />
            }
            label="Include Initial Pool Play"
          />
        )}

        <Button variant="contained" onClick={handleGenerate} fullWidth sx={{ mt: 2 }}>
          Generate
        </Button>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default GenerateBracketModal;
