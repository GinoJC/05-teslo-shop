import { FC } from 'react';
import { Slide } from 'react-slideshow-image';
import styles from './ProductSlideshow.module.css';
import 'react-slideshow-image/dist/styles.css';

interface Props {
  images: string[];
}

const ProductSlideshow: FC<Props> = ({ images }) => {
  return (
    <Slide easing="ease" duration={7000} indicators>
      {images.map((image) => (
        <div key={image} className={styles['each-slide-effect']}>
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
            }}></div>
        </div>
      ))}
    </Slide>
  );
};

export default ProductSlideshow;
