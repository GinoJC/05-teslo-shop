import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { ItemCounter } from 'components/ui';
import { initialData } from 'database/products';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  editable?: boolean;
}

const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]];

const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
      {productsInCart.map((product) => (
        <Grid container spacing={2} mb={1} key={product.slug}>
          <Grid item xs={3}>
            <Link href={`/product/Slug`}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`/products/${product.images[0]}`}
                  sx={{ borderRadius: '5px' }}
                />
              </CardActionArea>
            </Link>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.sizes[0]}</strong>
              </Typography>
              {editable ? <ItemCounter /> : <Typography variant="h5">3 items</Typography>}
            </Box>
          </Grid>
          <Grid item xs={2} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button variant="text" color="secondary">
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default CartList;
