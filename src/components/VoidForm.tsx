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
  StepLabel,
  CircularProgress,
  Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { VoidFormData, NewNextAction } from '../types/void';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(2),
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    color: theme.palette.text.primary,
    '&.Mui-active': {
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
    '&.Mui-completed': {
      color: theme.palette.primary.light,
    },
  },
  '& .MuiStepIcon-root': {
    color: 'rgba(89, 58, 85, 0.3)',
    '&.Mui-active, &.Mui-completed': {
      color: theme.palette.primary.main,
    },
  },
}));

const steps = ['Acknowledge', 'Define the Void', 'Next Action'];

interface VoidFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: VoidFormData) => void;
}

export const VoidForm = ({ open, onClose, onSubmit }: VoidFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<VoidFormData>({
    title: '',
    description: '',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

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

  const handleSuggestAction = async () => {
    if (!formData.title || !functions) {
      console.error("Functions not available or no title provided.");
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);

    const getSuggestions = httpsCallable<{ title: string; description?: string }, { suggestions: string[] }>(functions, 'getAiSuggestions');

    try {
      const result = await getSuggestions({ 
        title: formData.title, 
        description: formData.description 
      });
      setSuggestions(result.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      // Optionally, set an error state to show a message to the user
      setSuggestions(['Could not get suggestions. Please try again.']);
    } finally {
      setIsSuggesting(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography 
              variant="body1" 
              gutterBottom
              sx={(theme: Theme) => ({
                color: theme.palette.text.primary,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              })}
            >
              Take a moment to acknowledge that you're feeling stuck. This is a normal part of the process,
              and you're taking a positive step by addressing it.
            </Typography>
            <Typography 
              variant="body1" 
              gutterBottom
              sx={(theme: Theme) => ({
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginTop: 2
              })}
            >
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
            <Typography 
              variant="body1" 
              gutterBottom
              sx={(theme: Theme) => ({
                color: theme.palette.text.primary,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              })}
            >
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
                    description: e.target.value,
                    completed: false,
                    estimatedMinutes: formData.nextAction?.estimatedMinutes,
                  } satisfies NewNextAction,
                })
              }
              helperText="Make it specific and physical, e.g., 'Open Google Doc titled Project Plan'"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button 
                onClick={handleSuggestAction} 
                startIcon={isSuggesting ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                disabled={isSuggesting || !formData.title || !functions}
                variant="outlined"
              >
                Suggest an Action
              </Button>
              {suggestions.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.map((suggestion, index) => (
                    <Chip 
                      key={index} 
                      label={suggestion} 
                      onClick={() => setFormData({
                        ...formData,
                        nextAction: {
                          description: suggestion,
                          completed: false,
                          estimatedMinutes: formData.nextAction?.estimatedMinutes,
                        } satisfies NewNextAction,
                      })}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </FormContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: (theme: Theme) => `linear-gradient(135deg, ${theme.palette.background.paper}, rgba(255, 255, 255, 0.92))`,
        }
      }}
    >
      <DialogTitle sx={(theme: Theme) => ({ 
        color: theme.palette.primary.main,
        fontWeight: 500,
        letterSpacing: '0.5px',
        pb: 3
      })}>
        Let's Get Unstuck
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <StyledStepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
          <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={onClose}
          color="primary"
          variant="text"
        >
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            sx={{
              color: 'rgba(89, 58, 85, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(89, 58, 85, 0.08)'
              }
            }}
          >
            Back
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleNext}
          color="primary"
        >
          {activeStep === steps.length - 1 ? 'Start Action' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
