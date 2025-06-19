import { Button } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const GRADIENT_START = '#FF6B6B';
const GRADIENT_END = '#FF8E53';
const SHADOW_COLOR = 'rgba(255, 105, 135, .3)';

const StyledButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  borderRadius: '28px',
  padding: theme.spacing(2, 4),
  fontSize: '1.2rem',
  textTransform: 'none',
  background: `linear-gradient(45deg, ${GRADIENT_START} 30%, ${GRADIENT_END} 90%)`,
  boxShadow: `0 3px 5px 2px ${SHADOW_COLOR}`,
  '&:hover': {
    background: `linear-gradient(45deg, ${GRADIENT_END} 30%, ${GRADIENT_START} 90%)`,
  },
}));

interface StuckButtonProps {
  onClick: () => void;
}

export const StuckButton = ({ onClick }: StuckButtonProps) => {
  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<PanToolIcon />}
    >
      I'm Stuck
    </StyledButton>
  );
};
