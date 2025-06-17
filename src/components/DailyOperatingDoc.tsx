import { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Collapse
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import type { NextAction } from '../types/void';
import { getTodaysNextActions, completeNextAction, uncompleteNextAction } from '../services/voidService';
import TimerIcon from '@mui/icons-material/Timer';
import { FocusTimer } from './FocusTimer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '.MuiListItemButton-root': {
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: theme.spacing(5),
}));

const StyledListItemText = styled(ListItemText)(() => ({
  '& .MuiTypography-root': {
    fontWeight: 400,
  },
}));

const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(({ theme }) => ({
  right: theme.spacing(2),
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
              ? { ...a, completed: true, completedAt: new Date() }
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
        sx={theme => ({
          color: theme.palette.primary.main,
          fontWeight: 500,
          letterSpacing: '0.5px',
          marginBottom: 3
        })}>
        Today's Next Actions
      </Typography>
      {actions.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
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
                  />
                </StyledListItemIcon>
                <StyledListItemText
                  primary={action.description}
                  sx={{
                    textDecoration: action.completed ? 'line-through' : 'none',
                    color: action.completed ? 'text.secondary' : 'text.primary',
                  }}
                />
                <StyledListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => setFocusedActionId(focusedActionId === action.id ? null : action.id)}
                    disabled={action.completed}
                  >
                    <TimerIcon />
                  </IconButton>
                </StyledListItemSecondaryAction>
              </StyledListItemButton>
              <Collapse in={focusedActionId === action.id} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4, pr: 4, pb: 2 }}>
                  <FocusTimer 
                    action={action}
                    onComplete={() => {
                      setFocusedActionId(null);
                      handleToggle(action.id);
                    }}
                  />
                </Box>
              </Collapse>
            </StyledListItem>
          ))}
        </List>
      )}
    </StyledPaper>
  );
};
