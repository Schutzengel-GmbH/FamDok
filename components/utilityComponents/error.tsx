import { Box, Typography } from '@mui/material';

type ErrorPageProps = { message?: string };

export default function ErrorPage({ message }: ErrorPageProps) {
  return (
    <Box
      sx={{
        pt: '2rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ alignSelf: 'center' }} variant="h5" color={'error'}>
        Fehler
      </Typography>
      <Typography sx={{ alignSelf: 'center' }} variant="body1">
        {message || 'Es ist ein unbekannter Fehler aufgetreten'}
      </Typography>
    </Box>
  );
}
