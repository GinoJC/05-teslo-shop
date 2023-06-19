import { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';
import { isValidObjectId } from 'mongoose';

type Data = { message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'DELETE':
      return deleteProduct(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const deleteProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id = '' } = req.query;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: 'El id del producto no es válido' });

  try {
    await db.connect();
    const product = await Product.findById(id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese id' });
    }

    await product.deleteOne({ _id: id });
    await db.disconnect();

    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Error al eliminar el producto' });
  }
};
