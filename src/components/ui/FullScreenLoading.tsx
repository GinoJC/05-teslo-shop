import { Box, CircularProgress, Typography } from '@mui/material';

const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)">
      <Typography mb={3} variant="h2" fontSize={20} fontWeight={200}>
        Cargando...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default FullScreenLoading;
