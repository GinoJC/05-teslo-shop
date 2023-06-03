import { db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  db.connect();
  const product = await Product.findOne({ slug }).lean();
  db.disconnect();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
  db.connect();
  const slugs = await Product.find().select('slug -_id').lean();
  db.disconnect();
  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  db.connect();
  const products = await Product.find({
    $text: { $search: term.toString().toLowerCase() },
  })
    .select('title images price inStock slug -_id')
    .lean();
  db.disconnect();

  return products;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  db.connect();
  const products = await Product.find().lean();
  db.disconnect();
  return JSON.parse(JSON.stringify(products));
};
