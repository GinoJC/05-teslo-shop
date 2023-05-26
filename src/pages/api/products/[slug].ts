import { db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string } | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);
    // case 'PUT':
    //   return putEntry(req, res);
    // case 'DELETE':
    //   return deleteEntry(req, res);
    default:
      return res.status(400).json({ message: 'Endpoint no válido' });
  }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (product) return res.status(200).json(product);
  return res.status(404).json({ message: 'Producto no encontrado' });
};

// const putEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
//   const { id } = req.query;

//   await db.connect();
//   const entryToUpdate = await Entry.findById(id);
//   if (!entryToUpdate) {
//     db.disconnect();
//     return res.status(404).json({ message: 'Entrada no encontrada' });
//   }

//   const { description = entryToUpdate.description, status = entryToUpdate.status } = req.body;
//   try {
//     const entry = await Entry.findByIdAndUpdate(
//       id,
//       { description, status },
//       { new: true, runValidators: true },
//     );
//     await db.disconnect();
//     return res.status(200).json(entry!);
//   } catch (error) {
//     await db.disconnect();
//     return res.status(400).json({ message: 'Error al actualizar la entrada' });
//   }
// };

// const deleteEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {};
