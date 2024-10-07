export const INSERT_PAYMENT = (columns: string, params: string) =>
  `INSERT INTO public.payments (${columns}) VALUES (${params});`;