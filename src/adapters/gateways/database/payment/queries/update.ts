export const UPDATE_PAYMENT = `UPDATE public.payments SET status=:status, external_id=:external_id, updated_at=:updated_at WHERE id=:id;`;
