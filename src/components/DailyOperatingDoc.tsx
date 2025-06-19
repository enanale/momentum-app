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
import { getTodaysNextActions, completeNextAction, uncompleteNextAction } from '../services/voidService';
import { serverTimestamp } from 'firebase/firestore';
import TimerIcon from '@mui/icons-material/Timer';
import { lazy, Suspense } from 'react';
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
}

export const DailyOperatingDoc = ({ userId, refreshTrigger = 0 }: DailyOperatingDocProps) => {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedActionId, setFocusedActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const todaysActions = await getTodaysNextActions(userId);
        setActions(todaysActions);
      } catch (error) {
        console.error('Error fetching next actions:', error);
        // TODO: Add error handling/notification
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [userId, refreshTrigger]);

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
        setActions(prevActions =>
          prevActions.map(a =>
            a.id === actionId
              ? { ...a, completed: true, completedAt: serverTimestamp() }
              : a
          )
        );
      }
    } catch (error) {
      console.error('Error toggling action completion:', error);
      // TODO: Add error handling/notification
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
          {actions.map((action) => (
            <StyledListItem
              key={action.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => setFocusedActionId(focusedActionId === action.id ? null : action.id)}
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
              }
            >
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
                  sx={{
                    textDecoration: action.completed ? 'line-through' : 'none',
                    color: action.completed ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)',
                    '& .MuiTypography-root': {
                      fontWeight: 400,
                      letterSpacing: '-0.011em',
                    },
                  }}
                />
              </StyledListItemButton>
              <Collapse in={focusedActionId === action.id} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4, pr: 4, pb: 2 }}>
                  {focusedActionId && (
                    <Suspense fallback={<Box sx={{ textAlign: 'center', p: 2 }}>Loading timer...</Box>}>
                      <FocusTimer
                        action={actions.find(a => a.id === focusedActionId)!}
                        onComplete={() => {
                          handleToggle(focusedActionId);
                          setFocusedActionId(null);
                        }}
                      />
                    </Suspense>
                  )}
                </Box>
              </Collapse>
            </StyledListItem>
          ))}
        </List>
      )}
    </StyledPaper>
  );
};
