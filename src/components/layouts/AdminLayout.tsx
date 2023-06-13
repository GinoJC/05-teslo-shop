import { FC, PropsWithChildren } from 'react';
import { AdminNavbar, SideMenu } from 'components';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
}

const AdminLayout: FC<PropsWithChildren<Props>> = ({ children, title, subtitle, icon }) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>
      <SideMenu />
      <main
        style={{
          margin: '80px auto',
          maxWidth: '1440px',
          padding: '0 30px',
        }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
      <footer></footer>
    </>
  );
};

export default AdminLayout;
