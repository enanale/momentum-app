import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface LogoProps {
  height?: number;
  sx?: SxProps<Theme>;
}

export const Logo = ({ height = 32, sx }: LogoProps) => {
  return (
    <Box
      component="img"
      src="/logo-v7.svg"
      alt="Momentum Logo"
      sx={{
        height,
        width: 'auto',
        ...sx
      }}
    />
  );
};
