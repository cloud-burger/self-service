export const GET_ORDERS =
  `select o.*,
    json_build_object(
      'id', c.id,
      'name', c.name,
      'document_number', c.document_number,
      'email', c.email,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) as customer,
    jsonb_agg(jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'category', p.category,
      'amount', p.amount,
      'quantity', op.quantity
    ))  as products
    from public.orders o 
    left join public.customers c on o.customer_id = c.id 
    join public.orders_products op on o.id = op.order_id 
    join public.products p on op.product_id = p.id 
    group by o.id, c.id
    order by o.created_at desc
    limit 10 offset (0)
  `;