import { FC } from 'react';
import { Button, Divider, Grid, Modal, Paper, Typography } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSubmit: () => void;
}

const AlertModal: FC<Props> = ({ open, onClose, onSubmit, title, subtitle }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1">{title}</Typography>
          </Grid>
          <Grid item>
            <Typography>{subtitle}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid xs={12} item display="flex" justifyContent="end">
            <Button variant="outlined" color="error" sx={{ mr: 2 }} onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="secondary" onClick={onSubmit}>
              Confirmar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default AlertModal;
