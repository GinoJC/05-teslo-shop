import axios from 'axios';
import { db } from 'database';
import { IOrder } from 'interfaces';
import { Order } from 'models';
import { isValidObjectId } from 'mongoose';

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) return null;

  await db.connect();
  const order = await Order.findById(id).lean();
  await db.disconnect();

  if (!order) return null;

  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) return [];

  await db.connect();
  const orders = await Order.find({ user: userId }).lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(orders));
};

export const verifyPaidOrder = async (paymentId: string, orderId: string) => {
  const { data } = await axios.get(`${process.env.MP_ORDERS_URL}/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  });

  if (data.status !== 'approved') {
    return {
      hasError: true,
      message: 'Orden no aprovada',
    };
  }

  await db.connect();
  const order = await Order.findById(orderId);

  if (!order) {
    db.disconnect();
    return {
      hasError: true,
      message: 'Orden inexistente',
    };
  }

  if (order.total !== data.transaction_details.total_paid_amount) {
    db.disconnect();
    return {
      hasError: true,
      message: 'El total de la orden y el monto pagado no coinciden',
    };
  }

  order.transactionId = paymentId;
  order.isPaid = true;
  await order.save();
  await db.disconnect();

  return {
    hasError: false,
    message: 'Orden pagada correctamente',
  };
};
