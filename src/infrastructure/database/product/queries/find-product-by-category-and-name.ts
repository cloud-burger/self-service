export const FIND_PRODUCT_BY_CATEGORY_AND_NAME =
  'SELECT * FROM public.products WHERE category = :category and lower(name) = :name';
