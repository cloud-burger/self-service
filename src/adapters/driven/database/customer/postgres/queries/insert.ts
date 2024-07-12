export const INSERT_CUSTOMER = (columns: string, params: string) =>
  `INSERT INTO public.customer (${columns}) VALUES (${params})`;
