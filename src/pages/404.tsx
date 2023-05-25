import { Box, Typography } from '@mui/material';
import { ShopLayout } from 'components';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <ShopLayout title="Page not found" pageDescription="No hay nada que mostrar">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
        <Typography variant="h1" fontSize={80} fontWeight={200}>
          404 |
        </Typography>
        <Typography ml={2}>No encontramos ninguna página</Typography>
      </Box>
    </ShopLayout>
  );
};

export default NotFoundPage;
