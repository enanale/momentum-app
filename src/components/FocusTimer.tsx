import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { NextAction } from '../types/void';
import { completeNextAction } from '../services/voidService';

interface FocusTimerProps {
  action: NextAction;
  onComplete: () => void;
  defaultMinutes?: number;
}

const TimerCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  width: '100%',
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
}));

const TimerDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '4.5rem',
  fontWeight: 300,
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  fontFamily: 'monospace',
  color: theme.palette.primary.main,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const ActionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(2),
}));

export const FocusTimer = ({ action, onComplete, defaultMinutes = 10 }: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(defaultMinutes * 60);
    setIsRunning(false);
  };

  const handleComplete = async () => {
    try {
      await completeNextAction(action.id);
      setIsComplete(true);
      onComplete();
    } catch (error) {
      console.error('Error completing action:', error);
      // TODO: Add error notification
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerCard elevation={3}>
      <CardContent>
        <ActionTitle variant="h6" gutterBottom>
          Current Focus:
        </ActionTitle>
        <Typography 
          variant="body1" 
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            color: 'rgba(0, 0, 0, 0.75)',
            lineHeight: 1.5
          }}>
          {action.description}
        </Typography>
        <TimerDisplay>
          {formatTime(timeLeft)}
        </TimerDisplay>
        <ButtonContainer>
          <IconButton
            size="large"
            onClick={toggleTimer}
            disabled={isComplete}
            sx={theme => ({
              backgroundColor: isComplete 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.25)
              },
              '&:disabled': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            })}
          >
            {isRunning ? (
              <PauseIcon sx={theme => ({ 
                color: isComplete 
                  ? alpha(theme.palette.primary.main, 0.4)
                  : theme.palette.primary.main
              })} />
            ) : (
              <PlayArrowIcon sx={theme => ({ 
                color: isComplete 
                  ? alpha(theme.palette.primary.main, 0.4)
                  : theme.palette.primary.main
              })} />
            )}
          </IconButton>
          <IconButton
            size="large"
            onClick={resetTimer}
            disabled={isComplete}
            sx={theme => ({
              backgroundColor: isComplete 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.25)
              },
              '&:disabled': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            })}
          >
            <RestartAltIcon sx={theme => ({ 
              color: isComplete 
                ? alpha(theme.palette.primary.main, 0.4)
                : theme.palette.primary.main
            })} />
          </IconButton>
          <IconButton
            size="large"
            onClick={handleComplete}
            disabled={isComplete}
            sx={theme => ({
              backgroundColor: isComplete 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.25)
              },
              '&:disabled': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            })}
          >
            <CheckCircleIcon sx={theme => ({ 
              color: isComplete 
                ? alpha(theme.palette.primary.main, 0.4)
                : theme.palette.primary.main
            })} />
          </IconButton>
        </ButtonContainer>
        {timeLeft === 0 && (
          <Typography 
            variant="h6" 
            align="center" 
            sx={theme => ({ 
              mt: 3,
              color: theme.palette.primary.main,
              fontWeight: 500,
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            })}>
            Time's up! Great work!
          </Typography>
        )}
      </CardContent>
    </TimerCard>
  );
};
