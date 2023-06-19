import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { AdminLayout } from 'components';
import { dbProducts } from 'database';
import { IProduct, ISize, IType, IGender } from 'interfaces';
import { tesloApi } from 'api';
import { Product } from 'models';

const validTypes: IType[] = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender: IGender[] = ['men', 'women', 'kid', 'unisex'];
const validSizes: ISize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISize[];
  slug: string;
  tags: string[];
  title: string;
  type: IType;
  gender: IGender;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        const newSlug =
          value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').toLocaleLowerCase() || '';
        setValue('slug', newSlug);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (formData: FormData) => {
    if (formData.images.length + selectedImages.length < 2) {
      enqueueSnackbar('Se necesitan al menos 2 imágenes', { variant: 'info' });
      return;
    }
    setIsSaving(true);
    const images = await saveNewFiles();
    if (images) formData.images = [...formData.images, ...images];

    try {
      await tesloApi({
        url: '/admin/products',
        method: formData._id ? 'PUT' : 'POST',
        data: formData,
      });
      enqueueSnackbar(formData._id ? 'Producto actualizado' : 'Producto creado');
      if (!formData._id) router.replace(`/admin/products/${formData.slug}`);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      enqueueSnackbar('Error al guardar los datos', { variant: 'error' });
    }
  };

  const onChangeSize = (size: ISize) => {
    const currentSizes = getValues('sizes');
    if (currentSizes.includes(size)) {
      return setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true },
      );
    }
    setValue('sizes', [...currentSizes, size], { shouldValidate: true });
  };

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLowerCase();
    setNewTagValue('');
    const currentTags = getValues('tags');
    if (currentTags.includes(newTag)) return;
    currentTags.push(newTag);
  };

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter((t) => t !== tag);
    setValue('tags', updatedTags, { shouldValidate: true });
  };

  const saveNewFiles = async () => {
    try {
      const newImages: string[] = [];
      for (const file of selectedImages) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
        setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
        newImages.push(data.message);
      }
      setSelectedImages([]);
      return newImages;
    } catch (error) {
      console.log(error);
    }
  };

  const onImagesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) return;
    const files = [];
    for (const file of target.files) {
      files.push(file);
    }
    setSelectedImages(files);
  };

  const onDeleteImage = (image: string) => {
    setValue(
      'images',
      getValues('images').filter((img) => img !== image),
      { shouldValidate: true },
    );
  };

  const deleteNewImage = (file: File) => {
    setSelectedImages(selectedImages.filter((image) => image !== file));
  };

  return (
    <AdminLayout
      title={'Producto'}
      subtitle={product._id ? `Editando: ${product.title}` : 'Creando nuevo producto'}
      icon={<DriveFileRenameOutline />}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSaving}>
            Guardar
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              rows={10}
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="Inventario"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo valor 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />
            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo valor 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <Divider sx={{ my: 1 }} />
            <Controller
              name="type"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FormControl sx={{ mb: 1 }}>
                  <FormLabel>Tipo</FormLabel>
                  <RadioGroup row {...field}>
                    {validTypes.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="secondary" />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Controller
              name="gender"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <FormControl sx={{ mb: 1 }}>
                  <FormLabel>Genero</FormLabel>
                  <RadioGroup row {...field}>
                    {validGender.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="secondary" />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={<Checkbox checked={getValues('sizes').includes(size)} />}
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (val) =>
                  val.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />
            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) => (code === 'Space' ? onNewTag() : undefined)}
            />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component="ul">
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column">
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}>
                Cargar imagen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: 'none' }}
                onChange={onImagesSelected}
              />
              <Chip
                label="Es necesario al 2 imagenes"
                color="error"
                variant="outlined"
                sx={{
                  display: getValues('images').length + selectedImages.length < 2 ? 'flex' : 'none',
                  mb: 2,
                }}
              />
              {!!getValues('images').length && (
                <>
                  <Grid item>
                    <FormLabel sx={{ mb: 1 }}>Imágenes existentes</FormLabel>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid container spacing={2}>
                    {getValues('images').map((img) => (
                      <Grid item xs={4} sm={3} key={img}>
                        <Card>
                          <CardMedia component="img" className="fadeIn" image={img} alt={img} />
                          <CardActions>
                            <Button fullWidth color="error" onClick={() => onDeleteImage(img)}>
                              Borrar
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {!!selectedImages.length && (
                <>
                  <Grid item mt={2}>
                    <FormLabel>Nuevas imágenes</FormLabel>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid container spacing={2}>
                    {selectedImages.map((img) => (
                      <Grid item xs={4} sm={3} key={img.name} justifyContent="center">
                        <Card>
                          <CardMedia
                            component={() => (
                              <Image
                                style={{ width: '100%', padding: '5px 10px' }}
                                alt={img.name}
                                width={120}
                                height={120}
                                src={URL.createObjectURL(img)}
                              />
                            )}
                            className="fadeIn"
                          />
                          <CardActions>
                            <Button fullWidth color="error" onClick={() => deleteNewImage(img)}>
                              Borrar
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  let product: IProduct | null;

  if (slug === 'new') {
    const tempProduct = JSON.parse(JSON.stringify(new Product()));
    delete tempProduct._id;
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
