export const INSERT_PRODUCT = (columns: string, params: string) =>
  `INSERT INTO public.products (${columns}) VALUES (${params})`;
