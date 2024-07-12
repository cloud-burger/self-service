export interface CustomerDbSchema {
  id: string;
  document_number: string;
  name: string;
  status: string;
  email?: string;
  created_at: string;
  updated_at: string;
}
