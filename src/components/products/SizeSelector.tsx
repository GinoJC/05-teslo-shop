import { FC } from 'react';
import { ISize } from 'interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
}

const SizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button key={size} size="small" color={selectedSize === size ? 'info' : 'primary'}>
          {size}
        </Button>
      ))}
    </Box>
  );
};

export default SizeSelector;
