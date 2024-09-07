import { OrderPaginationParams } from '~/domain/order/repositories/order';

export const FIND_MANY = (input: OrderPaginationParams) => {
  let clauses = '';

  if (input.status) {
    clauses = clauses.concat(' AND o.status = :status');
  }

  return `SELECT 
            o.*,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'document_number', c.document_number,
                'email', c.email,
                'created_at', c.created_at,
                'updated_at', c.updated_at
            ) AS customer,
            json_agg(json_build_object(
                'id', p.id,
                'name', p.name,
                'category', p.category,
                'description', p.description,
                'amount', p.amount,
                'created_at', p.created_at,
                'updated_at', p.updated_at,
                'quantity', op.quantity,
                'notes', op.notes
            )) AS products
          FROM public.orders o
          LEFT JOIN public.customers c ON o.customer_id = c.id
          JOIN public.orders_products op ON o.id = op.order_id
          JOIN public.products p ON op.product_id = p.id
          WHERE 1=1${clauses}
          GROUP BY o.id, c.id
          ORDER BY o.created_at desc
          limit :size::numeric
          offset (:page::numeric) * (:size::numeric - 1);`;
};
