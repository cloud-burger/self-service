export interface CustomerDbSchema {
  id: string;
  document_number: string;
  name: string;
  email?: string;
  created_at: Date;
  updated_at: Date;
}
