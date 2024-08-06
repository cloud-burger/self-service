export const INSERT_ORDER = (columns: string, params: string) =>
    `INSERT INTO public.orders (${columns}) VALUES (${params})`;

export const INSERT_ORDER_PRODUCT = (columns: string, params: string) =>
    `INSERT INTO public.orders_products (${columns}) VALUES (${params}) ON CONFLICT (order_id, product_id) DO NOTHING;`;
  