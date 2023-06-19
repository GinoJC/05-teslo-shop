import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { enqueueSnackbar } from 'notistack';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CardMedia, Grid, Tooltip, Typography } from '@mui/material';
import { AddOutlined, CategoryOutlined, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { AdminLayout, AlertModal, FullScreenLoading } from 'components';
import { IProduct } from 'interfaces';
import { tesloApi } from 'api';

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
  { field: 'title', headerName: 'Título', flex: 1 },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage: NextPage = () => {
  const { data, error, isLoading, mutate } = useSWR<IProduct[]>('/api/admin/products');
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string>('');

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

  const handleSubmitModal = async () => {
    try {
      setShowModal(false);
      const { data } = await tesloApi.delete(`/admin/products/${productToDelete}`);
      enqueueSnackbar(data.message);
      mutate();
    } catch (error: any) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
      setShowModal(false);
    }
  };

  const tableColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Acciones',
      align: 'center',
      renderCell: ({ row }) => (
        <>
          <GridActionsCellItem
            label="editar"
            icon={
              <Tooltip title="Editar">
                <Link href={`/admin/products/${row.slug}`}>
                  <EditOutlined color="primary" />
                </Link>
              </Tooltip>
            }
          />
          <GridActionsCellItem
            label="borrar"
            onClick={() => {
              setProductToDelete(row.id);
              setShowModal(true);
            }}
            icon={
              <Tooltip title="Borrar">
                <DeleteOutline color="error" />
              </Tooltip>
            }
          />
        </>
      ),
    },
  ];

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
            columns={tableColumns}
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
      <AlertModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
        title="Borrar Producto"
        subtitle="El producto será borrado de manera permanente. ¿Desea continuar?"
      />
    </AdminLayout>
  );
};

export default ProductsPage;
