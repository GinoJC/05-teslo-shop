import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary, ShopLayout } from 'components';
import { dbOrders } from 'database';
import { IOrder } from 'interfaces';
import { countries } from 'utils';
import { tesloApi } from 'api';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;
  const { firstName, lastName, address, address2, city, postalCode, phone } = shippingAddress;
  const country = countries.find(({ code }) => code === shippingAddress?.country)?.name;

  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '', { locale: 'es-AR' });

  const onSubmit = async () => {
    return new Promise((resolve, reject) => {
      tesloApi
        .post('/orders/pay', order)
        .then(({ data }) => resolve(data.body.id))
        .catch((err) => reject(err));
    });
  };

  return (
    <ShopLayout title={`Orden ${_id}`} pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Orden: {_id}
      </Typography>
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOutlined />}
        />
      )}
      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
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
              </Box>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 ?? `, ${address2}`}
              </Typography>
              <Typography>
                {city}, {postalCode}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary orderValues={{ numberOfItems, subTotal, tax, total }} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="Orden pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <Wallet
                    onSubmit={onSubmit}
                    customization={{
                      visual: { buttonBackground: 'black' },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '', payment_id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  if (payment_id) await dbOrders.verifyPaidOrder(payment_id.toString(), id.toString());

  const order = await dbOrders.getOrderById(id.toString());

  if (!order || order.user !== session.user.id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: { order },
  };
};

export default OrderPage;
