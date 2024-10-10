export const FIND_BY_ORDER_ID = `SELECT * FROM public.payments WHERE order_id = :order_id and status <> 'CANCELED'`;
