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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { NextAction } from '../types/void';
import { getTodaysNextActions, completeNextAction } from '../services/voidService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  maxWidth: '800px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

interface DailyOperatingDocProps {
  userId: string;
  refreshTrigger?: number;
}

export const DailyOperatingDoc = ({ userId, refreshTrigger = 0 }: DailyOperatingDocProps) => {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);

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
      await completeNextAction(actionId);
      setActions(prevActions =>
        prevActions.map(action =>
          action.id === actionId
            ? { ...action, completed: true, completedAt: new Date() }
            : action
        )
      );
    } catch (error) {
      console.error('Error completing action:', error);
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
      <Typography variant="h6" gutterBottom>
        Today's Next Actions
      </Typography>
      {actions.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
          No actions planned for today. Click "I'm Stuck" to get started!
        </Typography>
      ) : (
        <List>
          {actions.map((action) => (
            <ListItem
              key={action.id}
              disablePadding
              secondaryAction={
                <Typography variant="caption" color="text.secondary">
                  {action.estimatedMinutes} min
                </Typography>
              }
            >
              <ListItemButton onClick={() => handleToggle(action.id)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={action.completed}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={action.description}
                  sx={{
                    textDecoration: action.completed ? 'line-through' : 'none',
                    color: action.completed ? 'text.secondary' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </StyledPaper>
  );
};
