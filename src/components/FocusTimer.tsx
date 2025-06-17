import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const TimerDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 300,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  fontFamily: 'monospace',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
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
        <Typography variant="h6" gutterBottom>
          Current Focus:
        </Typography>
        <Typography variant="body1" gutterBottom>
          {action.description}
        </Typography>
        <TimerDisplay>
          {formatTime(timeLeft)}
        </TimerDisplay>
        <ButtonContainer>
          <IconButton
            size="large"
            onClick={toggleTimer}
            color="primary"
            disabled={isComplete}
          >
            {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            size="large"
            onClick={resetTimer}
            color="secondary"
            disabled={isComplete}
          >
            <RestartAltIcon />
          </IconButton>
          <IconButton
            size="large"
            onClick={handleComplete}
            color="success"
            disabled={isComplete}
          >
            <CheckCircleIcon />
          </IconButton>
        </ButtonContainer>
        {timeLeft === 0 && (
          <Typography variant="h6" color="success.main" align="center" sx={{ mt: 2 }}>
            Time's up! Great work!
          </Typography>
        )}
      </CardContent>
    </TimerCard>
  );
};
