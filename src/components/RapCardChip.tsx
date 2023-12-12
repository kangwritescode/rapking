import { Chip, SxProps, useTheme } from '@mui/material';

interface RapCardChipProps {
  label: string;
  size?: 'small' | 'medium';
  sx?: SxProps;
}

function RapCardChip({ label, size = 'medium', sx }: RapCardChipProps) {
  const theme = useTheme();

  return <Chip size={size} label={label} sx={{ color: theme.palette.grey[400], ...sx }} />;
}

export default RapCardChip;
