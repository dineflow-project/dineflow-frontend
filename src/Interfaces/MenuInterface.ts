export interface Menu{
    id: bigint;              // Assuming your database supports bigint
    vendor_id: bigint;       // Assuming your database supports bigint
    name: string;
    price: number;           // Use number for DECIMAL in TypeScript
    image_path: string;
    description: string | null;
    is_available: 'yes' | 'no'  // Allow null for description
  }