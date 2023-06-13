import { db } from 'database';
import { Order, Product, User } from 'models';
import { NextApiRequest, NextApiResponse } from 'next';

type Data =
  | { message: string }
  | {
      numberOfOrders: number;
      paidOrders: number;
      notPaidOrders: number;
      numberOfClients: number;
      numberOfProducts: number;
      productWithNoInventory: number;
      lowInventory: number;
    };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getDataOfDashboard(res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const getDataOfDashboard = async (res: NextApiResponse<Data>) => {
  await db.connect();

  const [
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    Order.find({ isPaid: false }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  });
};
