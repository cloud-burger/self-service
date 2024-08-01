export interface ProductDbSchema {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: number;
  image?: string;
  created_at: string;
  updated_at: string;
}
