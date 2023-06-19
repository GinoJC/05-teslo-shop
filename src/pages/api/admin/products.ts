import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';
import { isValidObjectId } from 'mongoose';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(res);
    case 'PUT':
      return updateProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
const getProducts = async (res: NextApiResponse<Data>) => {
  await db.connect();
  let products = await Product.find().sort({ title: 'asc' }).lean();
  await db.disconnect();

  products = products.map((product) => {
    product.images = product.images.map((image) =>
      image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`,
    );
    return product;
  });

  return res.status(200).json(products);
};

const updateProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id))
    return res.status(400).json({ message: 'El id del producto no es válido' });
  if (images.length < 2)
    return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });

  try {
    await db.connect();
    const product = await Product.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese id' });
    }

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId] = image.substring(image.lastIndexOf('/') + 1).split('.');
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.updateOne(req.body);
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2)
    return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });

  try {
    await db.connect();
    const productInDB = await Product.findOne({ slug: req.body.slug });
    if (productInDB) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
    }

    const product = new Product(req.body);
    await product.save();
    await db.disconnect();

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};
