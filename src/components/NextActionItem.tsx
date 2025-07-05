import { Suspense, lazy } from 'react';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import type { NextAction } from '../types/void';

const FocusTimer = lazy(() => import('./FocusTimer'));

// Styled components extracted from DailyOperatingDoc
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

const StyledListItemText = styled(ListItemText)(() => ({}));

interface NextActionItemProps {
  action: NextAction;
  isFocused: boolean;
  onToggle: (actionId: string) => Promise<{ completed: boolean } | void>;
  onFocus: (actionId: string | null) => void;
}

export const NextActionItem = ({ action, isFocused, onToggle, onFocus }: NextActionItemProps) => {
  const handleTimerComplete = () => {
    onToggle(action.id);
    onFocus(null);
  };

  const timerButton = !isFocused ? (
    <IconButton
      edge="end"
      onClick={() => onFocus(action.id)}
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

  const listItemContent = !isFocused ? (
    <ListItemButton role={undefined} dense>
      <StyledListItemIcon>
        <Checkbox
          edge="start"
          checked={action.completed}
          tabIndex={-1}
          disableRipple
          onClick={() => onToggle(action.id)}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-checked': {
              color: 'rgba(176, 136, 174, 0.92)',
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
    </ListItemButton>
  ) : null;

  return (
    <StyledListItem
      key={action.id}
      disablePadding
      secondaryAction={timerButton}
    >
      {listItemContent}
      <Collapse in={isFocused} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, pl: 4, pr: 4, pb: 2, width: '100%' }}>
          {isFocused && (
            <Suspense fallback={<Box sx={{ textAlign: 'center', p: 2 }}>Loading timer...</Box>}>              <FocusTimer
                action={action}
                onComplete={handleTimerComplete}
                onClose={() => onFocus(null)}
              />
            </Suspense>
          )}
        </Box>
      </Collapse>
    </StyledListItem>
  );
};
