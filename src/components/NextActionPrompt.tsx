import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface NextActionPromptProps {
  open: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
}

export const NextActionPrompt = ({ open, onClose, onSave }: NextActionPromptProps) => {
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (description.trim()) {
      onSave(description.trim());
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>What's the next action?</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Next action description"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
