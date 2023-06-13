import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { AdminLayout, FullScreenLoading } from 'components';
import { IUser } from 'interfaces';
import { tesloApi } from 'api';

const UsersPage: NextPage = () => {
  const { data, error, isLoading } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  if (error) return <Typography>Error al cargar la información</Typography>;
  if (isLoading) return <FullScreenLoading />;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'email', headerName: 'Correo', flex: 1 },
    { field: 'name', headerName: 'Nombre completo', flex: 2 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }) => (
        <Select
          value={row.role}
          label="Rol"
          onChange={({ target }) => onRoleUpdated(row.id, target.value)}
          sx={{ width: '300px' }}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="super-user">Super User</MenuItem>
          <MenuItem value="SEO">SEO</MenuItem>
        </Select>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  const onRoleUpdated = async (userId: string, role: string) => {
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? role : user.role,
    }));

    try {
      await tesloApi.put(`/admin/users`, { userId, role });
      setUsers(updatedUsers);
    } catch (error) {}
  };

  return (
    <AdminLayout title="Usuarios" subtitle="Mantenimiento de usuarios" icon={<PeopleOutline />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowSelection={false}
            pageSizeOptions={[5, 10, 20]}
            pagination={true}
            paginationModel={{
              page: 0,
              pageSize: 10,
            }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
