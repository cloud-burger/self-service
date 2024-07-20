export interface ProductDbSchema {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: string;
  image?: string;
  created_at: string;
  updated_at: string;
}
