import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { FullScreenLoading, ShopLayout, ProductList } from 'components';
import { useProducts } from 'hooks';

const WomenPage: NextPage = () => {
  const { data, isLoading } = useProducts('products?gender=women');

  return (
    <ShopLayout
      title="Teslo-Shop - Women"
      pageDescription="Encuentra los mejores productos para ellas">
      <Typography variant="h1" component="h1">
        Mujeres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para mujeres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={data} />}
    </ShopLayout>
  );
};

export default WomenPage;
