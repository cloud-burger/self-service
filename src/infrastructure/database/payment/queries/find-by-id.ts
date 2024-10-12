export const FIND_BY_ID = `SELECT * FROM public.payments WHERE id = :id and status <> 'CANCELED'`;
