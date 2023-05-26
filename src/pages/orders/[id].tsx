import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary, ShopLayout } from 'components';
import Link from 'next/link';

const OrderPage = () => {
  return (
    <ShopLayout title="Orden 133123223" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Orden: ABC123
      </Typography>
      <Chip
        sx={{ my: 2 }}
        label="Orden pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />
      <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOutlined />}
      />
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen (3 productos)</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <Link href="/checkout/address" style={{ color: 'black' }}>
                  Editar
                </Link>
              </Box>
              <Typography>Gino Carignano</Typography>
              <Typography>123 algún lugar</Typography>
              <Typography>Córdoba, Argentina</Typography>
              <Typography>+54 3583123456</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <Link href="/cart" style={{ color: 'black' }}>
                  Editar
                </Link>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="Orden pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
