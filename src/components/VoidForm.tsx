import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { VoidEntry } from '../types/void';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(2),
}));

const steps = ['Acknowledge', 'Define the Void', 'Next Action'];

interface VoidFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (voidEntry: Partial<VoidEntry>) => void;
}

export const VoidForm = ({ open, onClose, onSubmit }: VoidFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<VoidEntry>>({
    title: '',
    description: '',
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSubmit(formData);
      onClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Take a moment to acknowledge that you're feeling stuck. This is a normal part of the process,
              and you're taking a positive step by addressing it.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Remember: Clarity comes from action, not from endless planning.
            </Typography>
          </Box>
        );
      case 1:
        return (
          <FormContainer>
            <TextField
              label="What are you avoiding? (The Void)"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Name the specific project or task that's causing resistance"
            />
            <TextField
              label="Additional context (optional)"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              helperText="What makes this challenging? What's holding you back?"
            />
          </FormContainer>
        );
      case 2:
        return (
          <FormContainer>
            <Typography variant="body1" gutterBottom>
              Great! You've identified "{formData.title}". Now, let's break it down into a small,
              concrete action you can take in the next 5-15 minutes.
            </Typography>
            <TextField
              label="What's the smallest next physical action?"
              variant="outlined"
              fullWidth
              value={formData.nextAction?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nextAction: {
                    ...formData.nextAction,
                    description: e.target.value,
                    completed: false,
                  } as any,
                })
              }
              helperText="Make it specific and physical, e.g., 'Open Google Doc titled Project Plan'"
            />
          </FormContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Let's Get Unstuck</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Start Action' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
