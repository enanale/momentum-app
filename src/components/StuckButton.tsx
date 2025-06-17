import { Button } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  borderRadius: '28px',
  padding: theme.spacing(2, 4),
  fontSize: '1.2rem',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
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
