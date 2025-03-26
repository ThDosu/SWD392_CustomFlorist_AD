interface Catelogy {
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface UpdateCatelogy {
  name: string;
  description: string;
  is_active: boolean;
}
