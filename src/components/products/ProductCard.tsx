import React, { FC, useMemo, useState } from 'react';
import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { IProduct } from 'interfaces';
import Link from 'next/link';

interface Props {
  product: IProduct;
}

const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productImage = useMemo(
    () => (isHovered ? `products/${product.images[1]}` : `products/${product.images[0]}`),
    [isHovered, product.images],
  );

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Card>
        <Link href="/product/Slug" prefetch={false}>
          <CardActionArea>
            <CardMedia
              component="img"
              image={productImage}
              alt={product.title}
              className="fadeIn"
            />
          </CardActionArea>
        </Link>
      </Card>
      <Box sx={{ mt: 1 }} className={'fadeIn'}>
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  );
};

export default ProductCard;
