import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { AdminLayout, FullScreenLoading, SummaryTile } from 'components';
import { DashboardSummaryResponse } from 'interfaces';

const DashboardPage: NextPage = () => {
  const { data, error, isLoading } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // 30 segundos
  });
  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(
      () => setRefreshIn((current) => (current > 0 ? current - 1 : 30)),
      1000,
    );

    return () => clearInterval(interval);
  }, []);

  if (error) return <Typography>Error al cargar la información</Typography>;
  if (isLoading) return <FullScreenLoading />;

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout title="Dashboard" subtitle="Estadisticas generales" icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle="Ordenes totales"
          icon={<CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subTitle="Ordenes pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subTitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subTitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subTitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productWithNoInventory}
          subTitle="Sin Existencias"
          icon={<CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={lowInventory}
          subTitle="Bajo inventario"
          icon={<ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={refreshIn}
          subTitle="Actualización en:"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
