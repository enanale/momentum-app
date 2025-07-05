import { useEffect, useState } from 'react';
import {
  Box,
  List,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNextActions } from '../hooks/useNextActions';
import { NextActionItem } from './NextActionItem';
import { NextActionPrompt } from './NextActionPrompt';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  width: '100%',
  backgroundColor: 'rgba(10, 9, 32, 0.6)',
  backdropFilter: 'blur(20px) saturate(180%)',
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
}));

interface DailyOperatingDocProps {
  userId: string;
  refreshTrigger?: number;
  onTimerStateChange?: (isActive: boolean) => void;
}

export const DailyOperatingDoc = ({ userId, refreshTrigger = 0, onTimerStateChange }: DailyOperatingDocProps) => {
  const { actions, loading, error, handleToggle, handleSaveNextAction } = useNextActions(userId, refreshTrigger);
  const [focusedActionId, setFocusedActionId] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    onTimerStateChange?.(focusedActionId !== null);
  }, [focusedActionId, onTimerStateChange]);

  const handleToggleAndPrompt = async (actionId: string) => {
    const result = await handleToggle(actionId);
    if (result?.completed) {
      setIsPromptOpen(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <StyledPaper>
        <Typography color="error">Error: {error.message}</Typography>
      </StyledPaper>
    );
  }

  return (
    <>
      <StyledPaper elevation={3}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.019em' }}
        >
          Daily Operating Doc
        </Typography>
        {actions.length === 0 ? (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
            No actions planned for today. Click "I'm Stuck" to get started!
          </Typography>
        ) : (
          <List>
            {actions.map((action) => (
              <NextActionItem
                key={action.id}
                action={action}
                isFocused={focusedActionId === action.id}
                onToggle={handleToggleAndPrompt}
                onFocus={setFocusedActionId}
              />
            ))}
          </List>
        )}
      </StyledPaper>
      <NextActionPrompt
        open={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSave={(description) => {
          handleSaveNextAction(description);
          setIsPromptOpen(false);
        }}
      />
    </>
  );
};
