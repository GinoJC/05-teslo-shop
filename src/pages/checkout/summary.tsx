import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary, ShopLayout } from 'components';
import { useCartContext } from 'context';
import { countries } from 'utils';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems } = useCartContext();
  const country = countries.find(({ code }) => code === shippingAddress?.country)?.name;

  useEffect(() => {
    if (!Cookies.get('address')) router.push('/checkout/address');
  }, [router]);

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <Link href="/checkout/address" style={{ color: 'black' }}>
                  Editar
                </Link>
              </Box>
              <Typography>
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </Typography>
              <Typography>
                {shippingAddress?.address}
                {shippingAddress?.address2 ? `, ${shippingAddress?.address2}` : ''}
              </Typography>
              <Typography>
                {shippingAddress?.city}, {shippingAddress?.postalCode}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <Link href="/cart" style={{ color: 'black' }}>
                  Editar
                </Link>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
