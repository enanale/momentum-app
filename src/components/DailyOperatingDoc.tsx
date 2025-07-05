import { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,

  Checkbox,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { NextAction } from '../types/void';
import { getTodaysNextActions, completeNextAction, uncompleteNextAction, createNextAction } from '../services/voidService';
import { serverTimestamp } from 'firebase/firestore';
import TimerIcon from '@mui/icons-material/Timer';
import { lazy, Suspense } from 'react';
import { NextActionPrompt } from './NextActionPrompt';
const FocusTimer = lazy(() => import('./FocusTimer'));

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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '.MuiListItemButton-root': {
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(5),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

const StyledListItemText = styled(ListItemText)(() => ({
  // No styles needed
}));

interface DailyOperatingDocProps {
  userId: string;
  refreshTrigger?: number;
  onTimerStateChange?: (isActive: boolean) => void;
}

export const DailyOperatingDoc = ({ userId, refreshTrigger = 0, onTimerStateChange }: DailyOperatingDocProps) => {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedActionId, setFocusedActionId] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    onTimerStateChange?.(focusedActionId !== null);
  }, [focusedActionId, onTimerStateChange]);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      try {
        const todaysActions = await getTodaysNextActions(userId);
        setActions(todaysActions);
      } catch (error) {
        console.error('Error fetching next actions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [userId, refreshTrigger, refreshKey]);

  const handleToggle = async (actionId: string) => {
    try {
      const action = actions.find(a => a.id === actionId);
      if (!action) return;

      if (action.completed) {
        await uncompleteNextAction(actionId);
        setActions(prevActions =>
          prevActions.map(a =>
            a.id === actionId
              ? { ...a, completed: false, completedAt: undefined }
              : a
          )
        );
      } else {
        await completeNextAction(actionId);
        const updatedActions = actions.map(a =>
          a.id === actionId
            ? { ...a, completed: true, completedAt: serverTimestamp() }
            : a
        );
        setActions(updatedActions);
        setIsPromptOpen(true);
      }
    } catch (error) {
      console.error('Error toggling action completion:', error);
    }
  };

  const handleSaveNextAction = async (description: string) => {
    try {
      await createNextAction(userId, description);
      setRefreshKey(key => key + 1);
    } catch (error) {
      console.error('Error creating next action:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <StyledPaper elevation={3}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{
            color: '#fff',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            marginBottom: 3
          }}>
          Today's Next Actions
        </Typography>
        {actions.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
            No actions planned for today. Click "I'm Stuck" to get started!
          </Typography>
        ) : (
          <List>
            {actions.map((action) => {
              const isTimerFocused = focusedActionId === action.id;

              const timerButton = !isTimerFocused ? (
                <IconButton
                  edge="end"
                  onClick={() => setFocusedActionId(action.id)}
                  disabled={action.completed}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  <TimerIcon />
                </IconButton>
              ) : null;

              const listItemContent = !isTimerFocused ? (
                <StyledListItemButton role={undefined} dense>
                  <StyledListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={action.completed}
                      tabIndex={-1}
                      disableRipple
                      onClick={() => handleToggle(action.id)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'rgba(176, 136, 174, 0.92)', // theme.palette.primary.light
                        },
                      }}
                    />
                  </StyledListItemIcon>
                  <StyledListItemText
                    primary={action.description}
                    secondary={action.voidDescription ? `From: "${action.voidDescription}"` : undefined}
                    sx={{
                      '& .MuiListItemText-primary': {
                        textDecoration: action.completed ? 'line-through' : 'none',
                        color: action.completed ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 400,
                        letterSpacing: '-0.011em',
                      },
                      '& .MuiListItemText-secondary': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                        fontStyle: 'italic',
                        marginTop: '4px',
                        display: 'block',
                      },
                    }}
                  />
                </StyledListItemButton>
              ) : null;

              return (
                <StyledListItem
                  key={action.id}
                  disablePadding
                  secondaryAction={timerButton}
                >
                  {listItemContent}
                  <Collapse in={isTimerFocused} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', flexGrow: 1, pl: 4, pr: 4, pb: 2, width: '100%' }}>
                      {isTimerFocused && (
                        <Suspense fallback={<Box sx={{ textAlign: 'center', p: 2 }}>Loading timer...</Box>}>                          <FocusTimer
                            action={action}
                            onComplete={() => {
                              handleToggle(action.id);
                              setFocusedActionId(null);
                            }}
                            onClose={() => setFocusedActionId(null)}
                          />
                        </Suspense>
                      )}
                    </Box>
                  </Collapse>
                </StyledListItem>
              );
            })}
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
