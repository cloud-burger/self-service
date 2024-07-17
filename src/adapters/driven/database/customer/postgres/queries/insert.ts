export const INSERT_CUSTOMER = (columns: string, params: string) =>
  `INSERT INTO public.customers (${columns}) VALUES (${params})`;
