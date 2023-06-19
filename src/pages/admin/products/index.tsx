import { NextPage } from 'next';
import useSWR from 'swr';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CardMedia, Grid, Typography } from '@mui/material';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { AdminLayout, FullScreenLoading } from 'components';
import { IProduct } from 'interfaces';
import Link from 'next/link';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }) => (
      <Link href={`/product/${row.slug}`} target="_blank">
        <CardMedia component="img" alt={row.title} className="fadeIn" image={row.img} />
      </Link>
    ),
  },
  {
    field: 'title',
    headerName: 'Título',
    flex: 1,
    renderCell: ({ row }) => (
      <Link href={`/admin/products/${row.slug}`} style={{ color: 'black' }}>
        {row.title}
      </Link>
    ),
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage: NextPage = () => {
  const { data, error, isLoading } = useSWR<IProduct[]>('/api/admin/products');

  if (error) return <Typography>Error al cargar la información</Typography>;
  if (isLoading) return <FullScreenLoading />;

  const rows = data!.map((product) => ({
    id: product._id,
    slug: product.slug,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
  }));

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subtitle="Mantenimiento de productos"
      icon={<CategoryOutlined />}>
      <Box display="flex" justifyContent="end" mb={2}>
        <Button startIcon={<AddOutlined />} color="secondary" href="/admin/products/new">
          Crear Producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowSelection={false}
            pageSizeOptions={[5, 10, 20, 50]}
            pagination={true}
            paginationModel={{
              page: 0,
              pageSize: 50,
            }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
