export const INSERT_ORDER = (columns: string, params: string) =>
  `INSERT INTO public.orders (${columns}) VALUES (${params}) RETURNING number;`;

export const INSERT_ORDER_PRODUCT = (columns: string, params: string) =>
  `INSERT INTO public.orders_products (${columns}) VALUES (${params});`;
