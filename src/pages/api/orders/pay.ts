import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { IOrder } from 'interfaces';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const order: IOrder = req.body;

  try {
    const preference: CreatePreferencePayload = {
      items: order.orderItems.map(({ _id, title, price, quantity }) => ({
        id: _id,
        title,
        unit_price: price * (1 + Number(process.env.NEXT_PUBLIC_TAX_RATE)),
        quantity,
      })),
      payer: {
        name: order.shippingAddress.firstName,
        surname: order.shippingAddress.lastName,
        address: {
          street_name: order.shippingAddress.address,
          zip_code: order.shippingAddress.postalCode,
        },
      },
      payment_methods: {
        excluded_payment_types: [
          {
            id: 'ticket',
          },
        ],
      },
      auto_return: 'all',
      back_urls: {
        success: `localhost:3000/orders/${order._id}`,
        failure: `localhost:3000/orders/${order._id}`,
        pending: `localhost:3000/orders/${order._id}`,
      },
    };

    const { body } = await mercadopago.preferences.create(preference);

    res.status(200).json({ body });
  } catch (error) {
    res.status(400).json({ message: 'Error procesando el pago' });
  }
};
