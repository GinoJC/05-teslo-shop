import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary, ShopLayout } from 'components';
import { useCartContext } from 'context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CartPage = () => {
  const router = useRouter();
  const { isLoaded, cart } = useCartContext();

  useEffect(() => {
    if (isLoaded && cart.length === 0) router.replace('/cart/empty');
  }, [isLoaded, cart, router]);

  if (!isLoaded) {
    return <></>;
  }

  return (
    <ShopLayout title="Carrito" pageDescription="Carrito de compras de la tienda">
      <Typography variant="h1" component="h1">
        Carrito
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address">
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
