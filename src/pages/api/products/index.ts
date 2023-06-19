import { SHOP_CONSTANTS, db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);

    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;

  let condition = {};

  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(gender.toString()))
    condition = { gender };

  await db.connect();
  let products = await Product.find(condition)
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();
  products = products.map((product) => {
    product.images = product.images.map((image) =>
      image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`,
    );
    return product;
  });
  return res.status(200).json(products);
};
