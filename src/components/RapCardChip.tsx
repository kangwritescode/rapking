import { Chip } from '@mui/material';

interface RapCardChipProps {
  label: string;
}

function RapCardChip({ label }: RapCardChipProps) {
  return <Chip label={label} sx={theme => ({ color: theme.palette.grey[400] })} />;
}

export default RapCardChip;
